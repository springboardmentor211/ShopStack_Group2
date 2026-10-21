package com.shopstack.payment.service;

import com.shopstack.order.entity.Order;
import com.shopstack.order.entity.OrderStatus;
import com.shopstack.order.repository.OrderRepository;
import com.shopstack.payment.dto.PaymentProcessRequest;
import com.shopstack.payment.dto.PaymentRequest;
import com.shopstack.payment.dto.PaymentResponse;
import com.shopstack.payment.entity.Payment;
import com.shopstack.payment.entity.PaymentStatus;
import com.shopstack.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    // Initiate payment for an order
    @Transactional
    public PaymentResponse initiatePayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + request.getOrderId()));

        if (paymentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new RuntimeException("Payment record already exists for order id: " + order.getId());
        }

        // Generate a temporary/mock transaction reference
        String txnReference = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .status(PaymentStatus.PENDING)
                .transactionId(txnReference)
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return mapToPaymentResponse(savedPayment);
    }

    // Process/Verify payment status (Simulating gateway response)
    @Transactional
    public PaymentResponse processPayment(Long paymentId, PaymentProcessRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment record not found with id: " + paymentId));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new RuntimeException("Payment is already completed");
        }

        payment.setTransactionId(request.getTransactionId());

        if (request.isSuccess()) {
            payment.setStatus(PaymentStatus.SUCCESS);
            
            // Update order status to PAID
            Order order = payment.getOrder();
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        Payment updatedPayment = paymentRepository.save(payment);
        return mapToPaymentResponse(updatedPayment);
    }

    // Get payment details by order ID
    public PaymentResponse getPaymentByOrderId(Long orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment not found for order id: " + orderId));
        return mapToPaymentResponse(payment);
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}