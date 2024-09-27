// src/main/java/com/example/dermatel/controllers/DermatologistController.java
package com.example.dermatel.controllers;

import com.example.dermatel.dto.DermatologistDto;
import com.example.dermatel.entities.UserProfile;
import com.example.dermatel.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class DermatologistController {

    @Autowired
    private UserService userService;

    @GetMapping("/dermatologists")
    public ResponseEntity<List<DermatologistDto>> getDermatologists() {
        List<DermatologistDto> dermatologists = userService.getDermatologists()
                .stream()
                .map(dermatologist -> new DermatologistDto(dermatologist.getId(), dermatologist.getFullName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dermatologists);
    }
}