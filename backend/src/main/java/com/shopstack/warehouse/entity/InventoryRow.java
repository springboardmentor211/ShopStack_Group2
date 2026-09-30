package com.shopstack.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory_rows",
        uniqueConstraints = @UniqueConstraint(name = "uk_warehouse_sku_bin", columnNames = {"warehouse_id", "sku", "bin"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryRow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_id", nullable = false, length = 20)
    private String warehouseId;

    @Column(nullable = false, length = 30)
    private String sku;

    @Column(nullable = false, length = 10)
    private String zone;

    @Column(nullable = false, length = 20)
    private String bin;

    @Column(nullable = false)
    @Builder.Default
    private Integer qty = 0;
}