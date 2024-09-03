package com.example.dermatel.controllers;

import com.example.dermatel.dto.UserProfileCreateDto;
import com.example.dermatel.dto.UserProfileDto;
import com.example.dermatel.dto.UserProfileUpdateDto;
import com.example.dermatel.services.UserProfileService;
import com.example.dermatel.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/me/profile")
@RequiredArgsConstructor
@Slf4j
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<UserProfileDto> getProfile(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null) {
            log.warn("No token found in the request.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = jwtUtil.extractUserId(token);
        if (userId == null) {
            log.warn("Unable to extract user ID from token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            UserProfileDto profile = userProfileService.getProfile(userId);
            log.info("Successfully retrieved profile for user ID: {}", userId);
            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException e) {
            log.error("Profile not found for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<String> createProfile(
            @ModelAttribute UserProfileCreateDto createDto,
            HttpServletRequest request) {

        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null) {
            log.warn("No token found in the request.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Long userId = jwtUtil.extractUserId(token);
        if (userId == null) {
            log.warn("Unable to extract user ID from token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        try {
            userProfileService.createProfile(userId, createDto);
            log.info("Successfully created profile for user ID: {}", userId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Profile created successfully");
        } catch (IOException e) {
            log.error("Error creating profile for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating profile");
        } catch (IllegalArgumentException e) {
            log.error("Profile already exists for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Profile already exists");
        }
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateProfile(
            @ModelAttribute UserProfileUpdateDto updateDto,
            HttpServletRequest request) {

        String token = jwtUtil.getTokenFromRequest(request);
        if (token == null) {
            log.warn("No token found in the request.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        Long userId = jwtUtil.extractUserId(token);
        if (userId == null) {
            log.warn("Unable to extract user ID from token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        try {
            userProfileService.updateProfile(userId, updateDto);
            log.info("Successfully updated profile for user ID: {}", userId);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (IOException e) {
            log.error("Error processing file for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing file");
        } catch (IllegalArgumentException e) {
            log.error("Profile not found for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
        } catch (Exception e) {
            log.error("Unexpected error updating profile for user ID: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error");
        }
    }
}
