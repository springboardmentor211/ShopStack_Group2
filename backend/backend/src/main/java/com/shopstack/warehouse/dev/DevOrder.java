package com.shopstack.warehouse.dev;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

/**
 * DEV STAND-IN for the order module's header table. Backed by {@code dev_orders} from
 * V5__seed_dev_fulfillment_data.sql and read only by {@code StubOrderFulfillmentPort}.
 *
 * <p>Delete together with the order module's real entity. Nothing in the warehouse module
 * outside the port package references this type.
 */
@Entity
@Table(name = "dev_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevOrder {

    @Id
    @Column(length = 20)
    private String id;

    @Column(name = "warehouse_id", nullable = false, length = 20)
    private String warehouseId;

    /** Lower-case wire form of {@code OrderStatus}; see {@code OrderStatus#wireValue}. */
    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "placed_at", nullable = false)
    private Instant placedAt;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 30)
    private String customerPhone;

    @Column(name = "address_line", length = 200)
    private String addressLine;

    @Column(length = 100)
    private String city;

    @Version
    @Column(nullable = false)
    @Builder.Default
    private Integer version = 0;
}
