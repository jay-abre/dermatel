package com.example.dermatel.repositories;

import com.example.dermatel.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Use Optional to handle the absence of a user
    Optional<User> findByUsername(String username);

    // Method to find users by their role
    Optional<User> findByRole(String role);

    // Method to count users by their role
    long countByRole(String role);

    // Check if a username exists
    boolean existsByUsername(String username);
}
