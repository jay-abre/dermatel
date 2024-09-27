// AppointmentService.java
package com.example.dermatel.services;

import com.example.dermatel.dto.AppointmentDto;
import com.example.dermatel.dto.PatientInfoDto;
import com.example.dermatel.dto.PaymentStatusDto;
import com.example.dermatel.entities.Appointment;
import com.example.dermatel.repositories.AppointmentRepository;
import com.example.dermatel.repositories.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserProfileRepository userProfileRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, UserProfileRepository userProfileRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userProfileRepository = userProfileRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByUserId(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public Appointment saveAppointment(Appointment appointment) {
        if (isDateInPast(appointment.getAppointmentDate())) {
            throw new IllegalArgumentException("Appointment date cannot be in the past.");
        }
        if (isDateBooked(appointment.getUserId(), appointment.getAppointmentDate(), appointment.getId())) {
            throw new IllegalArgumentException("You have already booked an appointment on this date.");
        }
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    private boolean isDateInPast(Date appointmentDate) {
        return appointmentDate.before(new Date());
    }

    private boolean isDateBooked(Long userId, Date appointmentDate, Long currentAppointmentId) {
        List<Appointment> userAppointments = appointmentRepository.findByUserId(userId);
        LocalDateTime newAppointmentTime = toLocalDateTime(appointmentDate);

        for (Appointment existingAppointment : userAppointments) {
            if (existingAppointment.getId().equals(currentAppointmentId)) {
                continue; // Skip the current appointment being updated
            }
            LocalDateTime existingAppointmentTime = toLocalDateTime(existingAppointment.getAppointmentDate());

            // Compare year, month, day, and hour
            if (isSameHour(existingAppointmentTime, newAppointmentTime)) {
                return true;
            }
        }
        return false;
    }

    private boolean isSameHour(LocalDateTime dateTime1, LocalDateTime dateTime2) {
        return dateTime1.getYear() == dateTime2.getYear() &&
                dateTime1.getMonth() == dateTime2.getMonth() &&
                dateTime1.getDayOfMonth() == dateTime2.getDayOfMonth() &&
                dateTime1.getHour() == dateTime2.getHour();
    }

    private LocalDateTime toLocalDateTime(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    public void updateReferenceNumber(Long appointmentId, String referenceNumber, String paymentLink) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setReferenceNumber(referenceNumber);
        appointment.setPaymentLink(paymentLink);
        appointmentRepository.save(appointment);
    }

    public void updatePaymentStatus(Long appointmentId, Appointment.PaymentStatus paymentStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setPaymentStatus(paymentStatus);
        appointmentRepository.save(appointment);
    }

    public List<AppointmentDto> getAppointmentsForDermatologist(Long dermatologistId) {
        List<Appointment> appointments = appointmentRepository.findByDermatologistId(dermatologistId);
        return appointments.stream()
                .map(appointment -> new AppointmentDto(
                        appointment.getId(),
                        appointment.getUserId(),
                        appointment.getDermatologistId(),
                        toLocalDateTime(appointment.getAppointmentDate()),
                        appointment.getPatientName())) // Include patientName
                .collect(Collectors.toList());
    }

    public List<PaymentStatusDto> getPaymentStatusByDermatologistId(Long dermatologistId) {
        return appointmentRepository.findByDermatologistId(dermatologistId)
                .stream()
                .map(appointment -> new PaymentStatusDto(
                        appointment.getPatientName(),
                        appointment.getReferenceNumber(),
                        appointment.getPaymentStatus()
                ))
                .collect(Collectors.toList());
    }

    public List<PatientInfoDto> getPatientsByDermatologistId(Long dermatologistId) {
        List<Long> userIds = appointmentRepository.findByDermatologistId(dermatologistId)
                .stream()
                .map(appointment -> appointment.getUserId())
                .collect(Collectors.toList());

        return userProfileRepository.findByUserIdIn(userIds)
                .stream()
                .map(userProfile -> new PatientInfoDto(
                        userProfile.getUserId(),
                        userProfile.getFullName(),
                        userProfile.getAddress(),
                        userProfile.getPhoneNumber(),
                        userProfile.getDateOfBirth()
                ))
                .collect(Collectors.toList());
    }
}