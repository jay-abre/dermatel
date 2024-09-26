package com.example.dermatel.controllers;

import com.example.dermatel.services.PayMongoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PayMongoService payMongoService;

    @Autowired
    public PaymentController(PayMongoService payMongoService) {
        this.payMongoService = payMongoService;
    }

    @PostMapping("/create-link")
    public ResponseEntity<String> createPaymentLink(@RequestParam int amount, @RequestParam String description) {
        return payMongoService.createPaymentLink(amount, description);
    }
        @GetMapping("/retrieve-link")
        public ResponseEntity<String> retrievePaymentLink(@RequestParam String referenceNumber) {
            return payMongoService.retrievePaymentLink(referenceNumber);
        }
}