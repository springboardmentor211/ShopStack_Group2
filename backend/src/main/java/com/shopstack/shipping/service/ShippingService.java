package com.shopstack.shipping.service;

import com.shopstack.order.entity.Order;
import com.shopstack.order.entity.OrderStatus;
import com.shopstack.order.repository.OrderRepository;
import com.shopstack.shipping.dto.CreateShipmentRequest;
import com.shopstack.shipping.dto.ShipmentResponse;
import com.shopstack.shipping.entity.Shipment;
import com.shopstack.shipping.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShippingService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    // Create Shipment and Mark Order SHIPPED
    @Transactional
    public ShipmentResponse createShipment(CreateShipmentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + request.getOrderId()));

        if (order.getStatus() != OrderStatus.PAID) {
            throw new RuntimeException("Order must be PAID before creating a shipment");
        }

        if (shipmentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new RuntimeException("Shipment already exists for order id: " + order.getId());
        }

        // Auto-generate tracking number
        String trackingNo = "TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Shipment shipment = Shipment.builder()
                .order(order)
                .trackingNumber(trackingNo)
                .courierPartner(request.getCourierPartner())
                .shippingAddress(order.getShippingAddress())
                .estimatedDeliveryDate(request.getEstimatedDeliveryDate())
                .build();

        // Update Order Status to SHIPPED
        order.setStatus(OrderStatus.SHIPPED);
        orderRepository.save(order);

        Shipment savedShipment = shipmentRepository.save(shipment);
        return mapToShipmentResponse(savedShipment);
    }

    // Mark Shipment as DELIVERED
    @Transactional
    public ShipmentResponse markAsDelivered(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found with id: " + shipmentId));

        Order order = shipment.getOrder();
        order.setStatus(OrderStatus.DELIVERED);
        orderRepository.save(order);

        shipment.setDeliveredAt(LocalDateTime.now());
        Shipment updatedShipment = shipmentRepository.save(shipment);

        return mapToShipmentResponse(updatedShipment);
    }

    // Get Shipment Details by Order ID
    public ShipmentResponse getShipmentByOrderId(Long orderId) {
        Shipment shipment = shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment details not found for order id: " + orderId));
        return mapToShipmentResponse(shipment);
    }

    private ShipmentResponse mapToShipmentResponse(Shipment shipment) {
        return ShipmentResponse.builder()
                .id(shipment.getId())
                .orderId(shipment.getOrder().getId())
                .trackingNumber(shipment.getTrackingNumber())
                .courierPartner(shipment.getCourierPartner())
                .shippingAddress(shipment.getShippingAddress())
                .orderStatus(shipment.getOrder().getStatus())
                .estimatedDeliveryDate(shipment.getEstimatedDeliveryDate())
                .deliveredAt(shipment.getDeliveredAt())
                .createdAt(shipment.getCreatedAt())
                .build();
    }
}