package com.example.dermatel.repositories;

import com.example.dermatel.entities.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    /**
     * Find the user profile by user ID.
     *
     * @param userId the user ID
     * @return an Optional containing the UserProfile if found, otherwise empty
     */
    Optional<UserProfile> findByUserId(Long userId);
}
