package com.example.dermatel.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDate;
    private String status;
    private String paymentStatus;
}
