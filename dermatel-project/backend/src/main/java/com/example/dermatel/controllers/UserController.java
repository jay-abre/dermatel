package com.example.dermatel.controllers;

import com.example.dermatel.constants.RoleConstants;
import com.example.dermatel.entities.User;
import com.example.dermatel.exceptions.InvalidRoleException;
import com.example.dermatel.repositories.UserRepository;
import com.example.dermatel.services.UserService;
import com.example.dermatel.utils.PasswordStrengthValidator;
import com.example.dermatel.utils.RoleValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/check-username")
    public ResponseEntity<UsernameAvailability> checkUsername(@RequestBody User user) {
        boolean isAvailable = !userRepository.existsByUsername(user.getUsername());
        logger.info("Username '{}' availability checked: {}", user.getUsername(), isAvailable);
        return ResponseEntity.ok().body(new UsernameAvailability(isAvailable));
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody @Valid User user) {
        if (!RoleValidator.isValidRole(user.getRole())) {
            logger.warn("Invalid role '{}' for user '{}'.", user.getRole(), user.getUsername());
            throw new InvalidRoleException("Invalid role " + user.getRole());
        }

        if (RoleConstants.ROLE_ADMIN.equals(user.getRole()) && userService.isAdminAlreadyExists()) {
            logger.warn("Admin user registration attempted but an admin already exists.");
            return new ResponseEntity<>("Admin already exists", HttpStatus.BAD_REQUEST);
        }

        if (!PasswordStrengthValidator.isValid(user.getPassword())) {
            logger.warn("Password validation failed for user '{}'.", user.getUsername());
            return new ResponseEntity<>("Password does not meet strength requirements", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userRepository.save(user);
        logger.info("User '{}' registered successfully.", user.getUsername());
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
