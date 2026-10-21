package com.shopstack.payment.repository;

import com.shopstack.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Fetch payment details associated with a specific order ID
    Optional<Payment> findByOrderId(Long orderId);

    // Fetch payment record using external transaction ID
    Optional<Payment> findByTransactionId(String transactionId);
}