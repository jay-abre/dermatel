// MedicalRecordController.java
package com.example.dermatel.controllers;

import com.example.dermatel.entities.MedicalRecord;
import com.example.dermatel.services.MedicalRecordService;
import com.example.dermatel.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/upload")
    public ResponseEntity<MedicalRecord> uploadMedicalRecord(@RequestParam MultipartFile file, @RequestParam String patientName, HttpServletRequest request) throws IOException {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        MedicalRecord medicalRecord = medicalRecordService.saveMedicalRecord(userId, patientName, file);
        return ResponseEntity.ok(medicalRecord);
    }

    @GetMapping("/user")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByUserId(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long userId = jwtUtil.extractUserId(token);
        List<MedicalRecord> medicalRecords = medicalRecordService.getMedicalRecordsByUserId(userId);
        return ResponseEntity.ok(medicalRecords);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadMedicalRecord(@PathVariable Long id) {
        MedicalRecord medicalRecord = medicalRecordService.getMedicalRecordById(id);
        byte[] fileData = Base64.getDecoder().decode(medicalRecord.getData());
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"" + medicalRecord.getFileName() + "\"")
                .body(fileData);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(@PathVariable Long id, @RequestParam MultipartFile file, @RequestParam String patientName) throws IOException {
        MedicalRecord updatedRecord = medicalRecordService.updateMedicalRecord(id,  file);
        return ResponseEntity.ok(updatedRecord);
    }

    @GetMapping("/dermatologists/medical-records")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsForDermatologist(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromRequest(request);
        Long dermatologistId = jwtUtil.extractUserId(token);
        List<MedicalRecord> medicalRecords = medicalRecordService.getMedicalRecordsByDermatologistId(dermatologistId);
        return ResponseEntity.ok(medicalRecords);
    }
}