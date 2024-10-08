package com.example.dermatel.services;

import com.example.dermatel.dto.DermatologistDto;
import com.example.dermatel.dto.UserProfileCreateDto;
import com.example.dermatel.dto.UserProfileDto;
import com.example.dermatel.dto.UserProfileUpdateDto;
import com.example.dermatel.entities.UserProfile;
import com.example.dermatel.repositories.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    @Transactional
    public UserProfileDto createProfile(Long userId, UserProfileCreateDto createDto) throws IOException {
        log.info("Creating profile for user ID: {}", userId);

        Optional<UserProfile> existingProfile = userProfileRepository.findByUserId(userId);
        if (existingProfile.isPresent()) {
            log.warn("Profile already exists for user ID: {}", userId);
            throw new IllegalArgumentException("Profile already exists for user ID: " + userId);
        }

        UserProfile userProfile = new UserProfile();
        userProfile.setUserId(userId);
        userProfile.setFullName(createDto.getFullName());
        userProfile.setAddress(createDto.getAddress());
        userProfile.setPhoneNumber(createDto.getPhoneNumber());
        userProfile.setRole(createDto.getRole()); // Set role

        LocalDate dateOfBirth = createDto.getDateOfBirth();
        if (dateOfBirth != null) {
            Date birthDate = Date.from(dateOfBirth.atStartOfDay(ZoneId.systemDefault()).toInstant());
            userProfile.setDateOfBirth(birthDate);
            log.debug("Date of Birth set to: {}", birthDate);
        }

        MultipartFile document = createDto.getDocument();
        if (document != null && !document.isEmpty()) {
            String base64Document = convertToBase64(document);
            userProfile.setDocument(base64Document);
            log.debug("Document converted to Base64 for user ID: {}", userId);
        } else {
            log.warn("Document is null or empty for user ID: {}", userId);
        }

        userProfile.setCreatedAt(new Date());
        userProfileRepository.save(userProfile);
        log.info("Profile created successfully for user ID: {}", userId);

        return convertToDto(userProfile);
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UserProfileUpdateDto updateDto) throws IOException {
        log.info("Updating profile for user ID: {}", userId);

        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("Profile not found for user ID: {}", userId);
                    return new IllegalArgumentException("Profile not found for user ID: " + userId);
                });

        userProfile.setFullName(updateDto.getFullName());
        userProfile.setAddress(updateDto.getAddress());
        userProfile.setPhoneNumber(updateDto.getPhoneNumber());

        LocalDate dateOfBirth = updateDto.getDateOfBirth();
        if (dateOfBirth != null) {
            Date birthDate = Date.from(dateOfBirth.atStartOfDay(ZoneId.systemDefault()).toInstant());
            userProfile.setDateOfBirth(birthDate);
            log.debug("Date of Birth updated to: {}", birthDate);
        }

        MultipartFile document = updateDto.getDocument();
        if (document != null && !document.isEmpty()) {
            String base64Document = convertToBase64(document);
            userProfile.setDocument(base64Document);
            log.debug("Document updated and converted to Base64 for user ID: {}", userId);
        }

        userProfile.setUpdatedAt(new Date());
        userProfileRepository.save(userProfile);
        log.info("Profile updated successfully for user ID: {}", userId);

        return convertToDto(userProfile);
    }

    public UserProfileDto getProfile(Long userId) {
        log.info("Fetching profile for user ID: {}", userId);

        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    log.error("Profile not found for user ID: {}", userId);
                    return new IllegalArgumentException("Profile not found for user ID: " + userId);
                });

        log.info("Profile fetched successfully for user ID: {}", userId);
        return convertToDto(userProfile);
    }

    private String convertToBase64(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            log.error("File is null or empty, unable to convert to Base64");
            throw new IllegalArgumentException("File is null or empty");
        }

        log.info("Converting file: {} to Base64", file.getOriginalFilename());
        byte[] fileBytes = file.getBytes();
        log.debug("File size in bytes: {}", fileBytes.length); // Log file size for verification
        String base64String = Base64.getEncoder().encodeToString(fileBytes);
        log.debug("File successfully converted to Base64");
        return base64String;
    }

    private UserProfileDto convertToDto(UserProfile userProfile) {
        log.debug("Converting UserProfile entity to UserProfileDto for user ID: {}", userProfile.getUserId());

        UserProfileDto dto = new UserProfileDto();
        dto.setId(userProfile.getId());
        dto.setFullName(userProfile.getFullName());
        dto.setAddress(userProfile.getAddress());
        dto.setPhoneNumber(userProfile.getPhoneNumber());
        dto.setDateOfBirth(userProfile.getDateOfBirth());
        dto.setDocument(userProfile.getDocument());
        dto.setRole(userProfile.getRole()); // Set role in DTO
        dto.setCreatedAt(userProfile.getCreatedAt());
        dto.setUpdatedAt(userProfile.getUpdatedAt());

        log.debug("Conversion to UserProfileDto completed for user ID: {}", userProfile.getUserId());
        return dto;
    }
    public List<DermatologistDto> getDermatologists() {
        List<UserProfile> dermatologists = userProfileRepository.findByRole("ROLE_DERMATOLOGIST");
        return dermatologists.stream()
                .map(dermatologist -> new DermatologistDto(dermatologist.getId(), dermatologist.getFullName()))
                .collect(Collectors.toList());
    }
}