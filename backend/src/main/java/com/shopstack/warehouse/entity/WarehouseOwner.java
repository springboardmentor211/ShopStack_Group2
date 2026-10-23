package com.shopstack.warehouse.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "warehouse_owners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WarehouseOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "warehouse_id", nullable = false, length = 20)
    private String warehouseId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false, length = 30)
    private String role;
}
