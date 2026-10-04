package com.shopstack.warehouse.dto.request;

import java.time.LocalDate;

/**
 * Body of {@code POST /orders/{orderId}/confirm}.
 *
 * <p>Deliberately unannotated: bean validation would surface a missing or past date as a
 * 400, but the contract specifies 422 with the message "Choose a valid delivery date."
 * That check lives in {@code OrderDeskService}.
 */
public record ConfirmOrderRequest(
        LocalDate deliveryDate
) {
}
