package com.shopstack.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

/**
 * Pick state for one order line. Warehouse-owned floor state — the order line itself
 * belongs to the order module, so there is deliberately no foreign key to it.
 *
 * <p>Rows are upserted on first read of a pick list. The upsert never clears an existing
 * {@code picked} flag, so re-fetching the pick list cannot silently undo a picker's work.
 */
@Entity
@Table(name = "order_pick_items", indexes = {
        @Index(name = "idx_pick_items_wh", columnList = "warehouse_id,order_id")
})
@IdClass(OrderPickItemId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPickItem {

    @Id
    @Column(name = "order_id", length = 20)
    private String orderId;

    @Id
    @Column(name = "item_id", length = 30)
    private String itemId;

    @Column(name = "warehouse_id", nullable = false, length = 20)
    private String warehouseId;

    @Column(nullable = false, length = 30)
    private String sku;

    @Column(nullable = false)
    private Integer qty;

    @Column(nullable = false)
    @Builder.Default
    private Boolean picked = false;

    @Column(name = "picked_at")
    private Instant pickedAt;

    @Column(name = "picked_by", length = 100)
    private String pickedBy;
}
