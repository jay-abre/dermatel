package com.example.dermatel.controllers;

import com.example.dermatel.dto.AuthRequest;
import com.example.dermatel.dto.AuthResponse;
import com.example.dermatel.services.TokenBlacklistService;
import com.example.dermatel.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserDetailsService userDetailsService, TokenBlacklistService tokenBlacklistService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());

            // Generate JWT token
            String token = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());

            logger.info("User '{}' logged in successfully.", authRequest.getUsername());

            // Return the token in the response
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (BadCredentialsException e) {
            logger.warn("Login attempt failed for user '{}'.", authRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Invalid username or password"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        if (token != null && !jwtUtil.isTokenBlacklisted(token)) {
            tokenBlacklistService.blacklistToken(token);
            logger.info("Token '{}' has been blacklisted.", token);
        }
        return ResponseEntity.ok().build();
    }
}
