// src/main/java/com/example/dermatel/dto/AppointmentDto.java
package com.example.dermatel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private Long userId;
    private Long dermatologistId;
    private LocalDateTime appointmentDate;
    private String patientName;
}