package com.example.dermatel.services;

import com.example.dermatel.entities.Appointment;
import com.example.dermatel.repositories.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
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

}