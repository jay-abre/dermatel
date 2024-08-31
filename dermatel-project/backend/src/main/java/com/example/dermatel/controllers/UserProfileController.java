package com.example.dermatel.controllers;

import com.example.dermatel.dto.UserProfileDto;
import com.example.dermatel.dto.UserProfileUpdateDto;
import com.example.dermatel.services.UserProfileService;
import com.example.dermatel.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/api/me/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class);

    private final UserProfileService userProfileService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<UserProfileDto> getProfile(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null) {
            logger.warn("No token found in the request.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        Long userId = jwtUtil.extractUserId(token);
        if (userId == null) {
            logger.warn("Unable to extract user ID from token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        UserProfileDto profile = userProfileService.getProfile(userId);
        if (profile == null) {
            logger.info("Profile not found for user ID: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        logger.info("Successfully retrieved profile for user ID: {}", userId);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProfile(
            @RequestParam("fullName") String fullName,
            @RequestParam("address") String address,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("dateOfBirth") String dateOfBirth,
            @RequestParam(value = "document", required = false) MultipartFile document,
            HttpServletRequest request) {

        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null) {
            logger.warn("No token found in the request.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Long userId = jwtUtil.extractUserId(token);
        if (userId == null) {
            logger.warn("Unable to extract user ID from token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        try {
            UserProfileUpdateDto updateDto = new UserProfileUpdateDto();
            updateDto.setFullName(fullName);
            updateDto.setAddress(address);
            updateDto.setPhoneNumber(phoneNumber);
            updateDto.setDateOfBirth(dateOfBirth != null ? new SimpleDateFormat("yyyy-MM-dd").parse(dateOfBirth) : null);
            updateDto.setDocument(document);

            userProfileService.updateProfile(userId, updateDto);
            logger.info("Successfully updated profile for user ID: {}", userId);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (IOException | ParseException e) {
            logger.error("Error updating profile for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile");
        }
    }
}
