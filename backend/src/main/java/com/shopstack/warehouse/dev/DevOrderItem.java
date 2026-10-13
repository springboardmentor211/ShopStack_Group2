package com.shopstack.warehouse.dev;

import jakarta.persistence.*;
import lombok.*;

/**
 * DEV STAND-IN for the order module's line table. Backed by {@code dev_order_items} and
 * read only by {@code StubOrderFulfillmentPort}. Delete with {@link DevOrder}.
 */
@Entity
@Table(name = "dev_order_items")
@IdClass(DevOrderItemId.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DevOrderItem {

    @Id
    @Column(name = "order_id", length = 20)
    private String orderId;

    @Id
    @Column(name = "item_id", length = 30)
    private String itemId;

    @Column(nullable = false, length = 30)
    private String sku;

    @Column(name = "product_name", nullable = false, length = 150)
    private String productName;

    @Column(nullable = false)
    private Integer qty;
}
