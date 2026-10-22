package com.shopstack.warehouse.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Composite key for {@link OrderPickItem} — an order line is identified by the order it
 * belongs to plus its own item id. Must be {@link Serializable} and expose a no-arg
 * constructor for JPA.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderPickItemId implements Serializable {

    private String orderId;
    private String itemId;
}
