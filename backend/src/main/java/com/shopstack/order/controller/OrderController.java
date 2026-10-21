package com.shopstack.order.controller;

import com.shopstack.order.dto.OrderRequest;
import com.shopstack.order.dto.OrderResponse;
import com.shopstack.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // POST: Checkout and place order from cart
    @PostMapping("/customers/{customerId}/orders")
    public ResponseEntity<OrderResponse> checkout(
            @PathVariable Long customerId,
            @Valid @RequestBody OrderRequest request) {
        return ResponseEntity.ok(orderService.checkout(customerId, request));
    }

    // GET: Get order details by order ID
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    // GET: Get order history for a customer
    @GetMapping("/customers/{customerId}/orders")
    public ResponseEntity<List<OrderResponse>> getCustomerOrderHistory(@PathVariable Long customerId) {
        return ResponseEntity.ok(orderService.getCustomerOrderHistory(customerId));
    }
}