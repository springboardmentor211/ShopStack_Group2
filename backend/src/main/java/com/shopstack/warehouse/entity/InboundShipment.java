package com.shopstack.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "inbound_shipments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InboundShipment {

    @Id
    @Column(length = 20)
    private String id;

    @Column(name = "warehouse_id", nullable = false, length = 20)
    private String warehouseId;

    @Column(name = "vendor_id", nullable = false, length = 20)
    private String vendorId;

    @Column(nullable = false, length = 30)
    private String sku;

    @Column(nullable = false)
    private Integer qty;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "pending";

    @Column(length = 20)
    private String bin;

    @Column(name = "arrived_at", nullable = false)
    @Builder.Default
    private Instant arrivedAt = Instant.now();

    @Column(name = "received_at")
    private Instant receivedAt;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Integer version = 0;
}