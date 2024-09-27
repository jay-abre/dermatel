// PatientInfoDto.java
package com.example.dermatel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
public class PatientInfoDto {
    private Long userId;
    private String fullName;
    private String address;
    private String phoneNumber;
    private Date dateOfBirth;
}