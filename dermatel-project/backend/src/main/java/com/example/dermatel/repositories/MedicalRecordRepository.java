// MedicalRecordRepository.java
package com.example.dermatel.repositories;

import com.example.dermatel.entities.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByUserId(Long userId);
    List<MedicalRecord> findByUserIdIn(List<Long> userIds); // New method
}