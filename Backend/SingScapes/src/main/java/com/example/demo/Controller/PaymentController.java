package com.example.demo.Controller;

import com.example.demo.DTO.PaymentRequest;
import com.example.demo.DTO.UserIdDTO;
import com.example.demo.Service.PaymentService;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayment(@RequestBody UserIdDTO dto) {
        
        boolean verified = paymentService.verifyUser(dto.getUserId());
        if (verified) {
            return ResponseEntity.ok("User verified. Choose payment method: VISA, PAYNOW, PAYPAL");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User verification failed.");
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody PaymentRequest request) {
        boolean confirmed = paymentService.processPayment(request);
        if (confirmed) {
            return ResponseEntity.ok("Payment successful.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment failed. Returning to main UI.");
        }
    }

}