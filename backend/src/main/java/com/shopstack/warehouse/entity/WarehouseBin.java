package com.shopstack.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warehouse_bins",
        uniqueConstraints = @UniqueConstraint(name = "uk_warehouse_bin_label", columnNames = {"warehouse_id", "bin_label"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseBin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_id", nullable = false, length = 20)
    private String warehouseId;

    @Column(nullable = false, length = 10)
    private String zone;

    @Column(name = "bin_label", nullable = false, length = 20)
    private String binLabel;
}