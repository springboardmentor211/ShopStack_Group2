package com.shopstack.common.enums;

import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Locale;
import java.util.Optional;

/**
 * Shared order lifecycle state, read and written by Order Desk, Pickup, Packup and the
 * dashboard pipeline. Do not let individual services keep their own copy.
 *
 * <p>{@link #CANCELLED} is terminal but is reachable from any pre-shipped state, so it is
 * listed last rather than in lifecycle position. It is intentionally absent from
 * {@code OrderSummaryDto.PipelineDto}: the vendor contract mandates exactly seven
 * pipeline keys.
 *
 * <p>The wire format is lower-case ({@code "picked"}), per the API contracts, while the
 * Java constants are upper-case. {@link #wireValue()} and {@link #fromWire(String)} are the
 * only sanctioned conversions, so no caller hand-rolls {@code toLowerCase()}.
 */
public enum OrderStatus {
    PENDING,
    CONFIRMED,
    PICKED,
    PACKED,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED;

    @JsonValue
    public String wireValue() {
        return name().toLowerCase(Locale.ROOT);
    }

    /**
     * Accepts the wire form and the constant name, case-insensitively. Returns empty for
     * anything unrecognised so callers can raise a 422 with their own message rather than
     * leaking a parse failure.
     */
    public static Optional<OrderStatus> fromWire(String value) {
        if (value == null || value.isBlank()) {
            return Optional.empty();
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        for (OrderStatus status : values()) {
            if (status.name().equals(normalized)) {
                return Optional.of(status);
            }
        }
        return Optional.empty();
    }
}
