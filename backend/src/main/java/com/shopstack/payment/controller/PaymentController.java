package com.shopstack.payment.controller;

import com.shopstack.payment.dto.PaymentProcessRequest;
import com.shopstack.payment.dto.PaymentRequest;
import com.shopstack.payment.dto.PaymentResponse;
import com.shopstack.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // POST: Initiate payment
    @PostMapping
    public ResponseEntity<PaymentResponse> initiatePayment(@Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.initiatePayment(request));
    }

    // POST: Process / Verify payment status
    @PostMapping("/{paymentId}/process")
    public ResponseEntity<PaymentResponse> processPayment(
            @PathVariable Long paymentId,
            @Valid @RequestBody PaymentProcessRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(paymentId, request));
    }

    // GET: Fetch payment details by order ID
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }
}