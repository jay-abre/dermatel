package com.example.dermatel.controllers;

import com.example.dermatel.dto.AppointmentDto;
import com.example.dermatel.dto.DermatologistDto;
import com.example.dermatel.services.AppointmentService;
import com.example.dermatel.services.UserService;
import com.example.dermatel.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class DermatologistController {

    @Autowired
    private UserService userService;

    @Autowired
    private AppointmentService appointmentService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/dermatologists")
    public ResponseEntity<List<DermatologistDto>> getDermatologists() {
        List<DermatologistDto> dermatologists = userService.getDermatologists()
                .stream()
                .map(dermatologist -> new DermatologistDto(dermatologist.getId(), dermatologist.getFullName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dermatologists);
    }

    @GetMapping("/{dermatologistId}/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsForDermatologist(@PathVariable Long dermatologistId) {
        List<AppointmentDto> appointments = appointmentService.getAppointmentsForDermatologist(dermatologistId);
        return ResponseEntity.ok(appointments);
    }
    @GetMapping("/dermatologists/dashboard")
    public ResponseEntity<List<AppointmentDto>> getDermatologistDashboard(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long dermatologistId = jwtUtil.extractUserId(token);
        List<AppointmentDto> appointments = appointmentService.getAppointmentsForDermatologist(dermatologistId);
        return ResponseEntity.ok(appointments);
    }
}