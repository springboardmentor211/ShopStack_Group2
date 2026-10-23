package com.shopstack.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "stock_movements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockMovement {

    @Id
    @Column(length = 20)
    private String id;

    @Column(name = "warehouse_id", nullable = false, length = 20)
    private String warehouseId;

    @Column(nullable = false, length = 30)
    private String sku;

    @Column(nullable = false, length = 30)
    private String type;

    @Column(name = "from_loc", length = 100)
    private String fromLoc;

    @Column(name = "to_loc", length = 100)
    private String toLoc;

    @Column(nullable = false)
    private Integer qty;

    @Column(name = "performed_by", length = 100)
    private String performedBy;

    @Column(nullable = false)
    @Builder.Default
    private Instant at = Instant.now();
}