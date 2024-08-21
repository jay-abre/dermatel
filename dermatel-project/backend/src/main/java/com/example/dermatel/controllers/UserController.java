package com.example.dermatel.controllers;

import com.example.dermatel.constants.RoleConstants;
import com.example.dermatel.entities.User;
import com.example.dermatel.repositories.UserRepository;
import com.example.dermatel.services.UserService;
import com.example.dermatel.utils.RoleValidator;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestBody User user) {
        boolean isAvailable = !userRepository.existsByUsername(user.getUsername());
        return ResponseEntity.ok().body(new UsernameAvailability(isAvailable));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody @Valid User user) {
        if (!RoleValidator.isValidRole(user.getRole())) {
            return new ResponseEntity<>("Invalid role", HttpStatus.BAD_REQUEST);
        }

        if (RoleConstants.ROLE_ADMIN.equals(user.getRole()) && userService.isAdminAlreadyExists()) {
            return new ResponseEntity<>("Admin already exists", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userRepository.save(user);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    // DTO for username availability
    public static class UsernameAvailability {
        private boolean available;

        public UsernameAvailability(boolean available) {
            this.available = available;
        }

        public boolean isAvailable() {
            return available;
        }

        public void setAvailable(boolean available) {
            this.available = available;
        }
    }
}
