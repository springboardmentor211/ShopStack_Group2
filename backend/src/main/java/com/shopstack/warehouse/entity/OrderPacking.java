package com.shopstack.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Packing and outbound state for one order. Warehouse-owned, and like
 * {@link OrderPickItem} it has no foreign key to the order module's tables.
 *
 * <p>Note what is absent: {@code order.status}. The pipeline lives in the order module and
 * is reached through {@code OrderFulfillmentPort}; storing a second copy here would let the
 * two drift (customer contract §7). This row is created empty on first Packup read so the
 * API can always return the full {@code packing}/{@code outbound} objects with nulls
 * instead of omitting them.
 */
@Entity
@Table(name = "order_packings", indexes = {
        @Index(name = "idx_packings_wh", columnList = "warehouse_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPacking {

    @Id
    @Column(name = "order_id", length = 20)
    private String orderId;

    @Column(name = "warehouse_id", nullable = false, length = 20)
    private String warehouseId;

    /** small | medium | large */
    @Column(name = "box_size", length = 10)
    private String boxSize;

    @Column(name = "weight_kg", precision = 6, scale = 3)
    private BigDecimal weightKg;

    @Column(nullable = false)
    @Builder.Default
    private Boolean packed = false;

    @Column(name = "packed_at")
    private Instant packedAt;

    @Column(length = 60)
    private String carrier;

    @Column(name = "tracking_id", length = 30)
    private String trackingId;

    @Column(nullable = false)
    @Builder.Default
    private Boolean shipped = false;

    @Column(name = "shipped_at")
    private Instant shippedAt;
}
