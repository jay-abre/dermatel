// PaymentStatusDto.java
package com.example.dermatel.dto;

import com.example.dermatel.entities.Appointment;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentStatusDto {
    private String patientName;
    private String referenceNumber;
    private Appointment.PaymentStatus paymentStatus;
}