package com.shopstack.warehouse.dev;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Composite key for {@link DevOrderItem} — an order line is (orderId, itemId). Must be
 * {@link Serializable} with a no-arg constructor for JPA's {@code @IdClass} handling.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DevOrderItemId implements Serializable {

    private String orderId;
    private String itemId;
}
