package com.example.dermatel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
@NoArgsConstructor
public class UserProfileUpdateDto {
    private String fullName;
    private String address;
    private String phoneNumber;
    private Date dateOfBirth;
    private MultipartFile document;
}
