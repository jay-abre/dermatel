package com.example.dermatel.repositories;

import com.example.dermatel.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    Optional<User> findByRole(String role);
    long countByRole(String role);
}
