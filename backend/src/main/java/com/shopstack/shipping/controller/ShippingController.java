package com.shopstack.shipping.controller;

import com.shopstack.shipping.dto.CreateShipmentRequest;
import com.shopstack.shipping.dto.ShipmentResponse;
import com.shopstack.shipping.service.ShippingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/shipments")
@RequiredArgsConstructor
public class ShippingController {

    private final ShippingService shippingService;

    // POST: Create shipment (Assign Courier & Tracking No)
    @PostMapping
    public ResponseEntity<ShipmentResponse> createShipment(@Valid @RequestBody CreateShipmentRequest request) {
        return ResponseEntity.ok(shippingService.createShipment(request));
    }

    // PUT: Mark order/shipment as DELIVERED
    @PutMapping("/{shipmentId}/deliver")
    public ResponseEntity<ShipmentResponse> markAsDelivered(@PathVariable Long shipmentId) {
        return ResponseEntity.ok(shippingService.markAsDelivered(shipmentId));
    }

    // GET: Get tracking & shipment details by Order ID
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ShipmentResponse> getShipmentByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(shippingService.getShipmentByOrderId(orderId));
    }
}