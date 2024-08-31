package com.example.dermatel.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class UserProfileDto {
    private String fullName;
    private String address;
    private String phoneNumber;
    private Date dateOfBirth;
    private byte[] document; // Store the document as a byte array
}
