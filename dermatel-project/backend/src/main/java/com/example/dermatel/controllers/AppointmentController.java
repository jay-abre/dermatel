// AppointmentController.java
package com.example.dermatel.controllers;

import com.example.dermatel.entities.Appointment;
import com.example.dermatel.services.AppointmentService;
import com.example.dermatel.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final JwtUtil jwtUtil;
    private static final Logger logger = Logger.getLogger(AppointmentController.class.getName());

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

    @GetMapping("/my-appointment")
    public ResponseEntity<Appointment> getAppointmentById(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        logger.info("Extracted User ID: " + userId);
        Optional<Appointment> appointment = appointmentService.getAppointmentById(userId);
        if (appointment.isPresent()) {
            return ResponseEntity.ok(appointment.get());
        } else {
            logger.warning("No appointment found for User ID: " + userId);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        appointment.setUserId(userId);
        appointment.setPaymentStatus(Appointment.PaymentStatus.PENDING);
        appointment.setDermatologistId(appointment.getDermatologistId());
        appointment.setPatientName(appointment.getPatientName()); // Add patientName
        return appointmentService.saveAppointment(appointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        try {
            Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
            if (appointment.isPresent() && appointment.get().getUserId().equals(userId)) {
                Appointment updatedAppointment = appointment.get();
                updatedAppointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
                updatedAppointment.setDoctorName(appointmentDetails.getDoctorName());
                updatedAppointment.setPaymentStatus(Appointment.PaymentStatus.PENDING);
                updatedAppointment.setDermatologistId(appointmentDetails.getDermatologistId());
                return ResponseEntity.ok(appointmentService.saveAppointment(updatedAppointment));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/my-appointment/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        logger.info("Extracted User ID: " + userId);
        logger.info("Appointment ID to delete: " + id);
        try {
            Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
            if (appointment.isPresent() && appointment.get().getUserId().equals(userId)) {
                appointmentService.deleteAppointment(id);
                return ResponseEntity.noContent().build();
            } else {
                logger.warning("No appointment found for User ID: " + userId + " and Appointment ID: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.severe("Error deleting appointment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/reference-number")
    public ResponseEntity<Void> updateReferenceNumber(@PathVariable Long id, @RequestParam String referenceNumber, @RequestParam String paymentLink, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        logger.info("Extracted User ID: " + userId);
        logger.info("Appointment ID to update reference number: " + id);
        logger.info("New Reference Number: " + referenceNumber);
        try {
            Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
            if (appointment.isPresent() && appointment.get().getUserId().equals(userId)) {
                appointmentService.updateReferenceNumber(id, referenceNumber, paymentLink);
                return ResponseEntity.ok().build();
            } else {
                logger.warning("No appointment found for User ID: " + userId + " and Appointment ID: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.severe("Error updating reference number: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/payment-status")
    public ResponseEntity<Void> updatePaymentStatus(@PathVariable Long id, @RequestParam Appointment.PaymentStatus paymentStatus, HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        logger.info("Extracted User ID: " + userId);
        logger.info("Appointment ID to update payment status: " + id);
        logger.info("New Payment Status: " + paymentStatus);
        try {
            Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
            if (appointment.isPresent() && appointment.get().getUserId().equals(userId)) {
                appointmentService.updatePaymentStatus(id, paymentStatus);
                return ResponseEntity.ok().build();
            } else {
                logger.warning("No appointment found for User ID: " + userId + " and Appointment ID: " + id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.severe("Error updating payment status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}