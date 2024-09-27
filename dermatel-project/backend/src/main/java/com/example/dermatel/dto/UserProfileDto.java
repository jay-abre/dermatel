package com.example.dermatel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class UserProfileDto {
    private Long id;
    private String fullName;
    private String address;
    private String phoneNumber;
    private Date dateOfBirth;
    private String document;
    private Date createdAt;
    private Date updatedAt;
    private String role;
}
