package com.example.dermatel.services;

import com.example.dermatel.entities.MedicalRecord;
import com.example.dermatel.entities.Appointment;
import com.example.dermatel.repositories.MedicalRecordRepository;
import com.example.dermatel.repositories.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    private static final Logger logger = LoggerFactory.getLogger(MedicalRecordService.class);

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public MedicalRecord saveMedicalRecord(Long userId,String patientName,MultipartFile file) throws IOException {
        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());
        MedicalRecord medicalRecord = MedicalRecord.builder()
                .userId(userId)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .data(base64Data)
                .patientName(patientName)
                .build();
        return medicalRecordRepository.save(medicalRecord);
    }

    public List<MedicalRecord> getMedicalRecordsByUserId(Long userId) {
        List<MedicalRecord> records = medicalRecordRepository.findByUserId(userId);
        logger.info("Fetched medical records for user {}: {}", userId, records);
        return records;
    }

    public MedicalRecord getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id).orElseThrow(() -> new RuntimeException("Record not found"));
    }

    public void deleteMedicalRecord(Long id) {
        medicalRecordRepository.deleteById(id);
    }

    public MedicalRecord updateMedicalRecord(Long id, MultipartFile file) throws IOException {
        MedicalRecord existingRecord = getMedicalRecordById(id);
        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());
        existingRecord.setFileName(file.getOriginalFilename());
        existingRecord.setFileType(file.getContentType());
        existingRecord.setData(base64Data);
        return medicalRecordRepository.save(existingRecord);
    }

    public List<MedicalRecord> getMedicalRecordsByDermatologistId(Long dermatologistId) {
        List<Long> userIds = appointmentRepository.findByDermatologistId(dermatologistId)
                .stream()
                .map(Appointment::getUserId)
                .collect(Collectors.toList());
        return medicalRecordRepository.findByUserIdIn(userIds);
    }
}