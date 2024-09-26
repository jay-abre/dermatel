package com.example.dermatel.controllers;

import com.example.dermatel.entities.Appointment;
import com.example.dermatel.services.AppointmentService;
import com.example.dermatel.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, JwtUtil jwtUtil) {
        this.appointmentService = appointmentService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Appointment> getAllAppointments(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        return appointmentService.getAppointmentsByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        if (appointment.isPresent() && appointment.get().getUserId().equals(userId)) {
            return ResponseEntity.ok(appointment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        appointment.setUserId(userId);
        appointment.setPaymentStatus(Appointment.PaymentStatus.PENDING);
        return appointmentService.saveAppointment(appointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        if (appointment.isPresent() && appointment.get().getUserId().equals(userId)) {
            Appointment updatedAppointment = appointment.get();
            updatedAppointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
            updatedAppointment.setDoctorName(appointmentDetails.getDoctorName());
            updatedAppointment.setPaymentStatus(Appointment.PaymentStatus.PENDING);
            return ResponseEntity.ok(appointmentService.saveAppointment(updatedAppointment));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        if (appointment.isPresent() && appointment.get().getUserId().equals(userId)) {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}