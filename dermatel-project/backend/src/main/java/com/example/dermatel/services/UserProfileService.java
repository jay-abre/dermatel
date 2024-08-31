package com.example.dermatel.services;

import com.example.dermatel.dto.UserProfileDto;
import com.example.dermatel.dto.UserProfileUpdateDto;
import com.example.dermatel.entities.UserProfile;
import com.example.dermatel.repositories.UserProfileRepository;
import com.example.dermatel.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileDto getProfile(Long userId) {
        Optional<UserProfile> userProfile = userProfileRepository.findByUserId(userId);
        return userProfile.map(this::convertToDto).orElse(null);
    }

    public UserProfileDto updateProfile(Long userId, UserProfileUpdateDto updateDto) throws IOException {
        UserProfile userProfile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        userProfile.setFullName(updateDto.getFullName());
        userProfile.setAddress(updateDto.getAddress());
        userProfile.setPhoneNumber(updateDto.getPhoneNumber());
        userProfile.setDateOfBirth(updateDto.getDateOfBirth());
        if (updateDto.getDocument() != null) {
            userProfile.setDocument(updateDto.getDocument().getBytes());
        }
        userProfileRepository.save(userProfile);

        return convertToDto(userProfile);
    }

    private UserProfileDto convertToDto(UserProfile userProfile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setFullName(userProfile.getFullName());
        dto.setAddress(userProfile.getAddress());
        dto.setPhoneNumber(userProfile.getPhoneNumber());
        dto.setDateOfBirth(userProfile.getDateOfBirth());
        dto.setDocument(userProfile.getDocument());
        return dto;
    }
}
