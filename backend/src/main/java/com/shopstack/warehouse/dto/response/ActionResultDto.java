package com.shopstack.warehouse.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Acknowledgement for the customer-side write actions.
 *
 * <p>{@code @JsonInclude(NON_NULL)} makes each action emit exactly the fields the contract
 * shows: {@code {"ok":true}} for a pick toggle, {@code {"ok":true,"status":"packed"}} for
 * pack, and {@code {"ok":true,"status":"shipped","trackingId":"BD-..."}} for ship. Without
 * it we would leak {@code "status": null} / {@code "trackingId": null} into responses the
 * contract specifies field-for-field.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ActionResultDto(
        boolean ok,
        String status,
        String trackingId
) {
    /**
     * Pick toggle: {@code {"ok":true}} and nothing else.
     *
     * <p>Named {@code okOnly} rather than {@code ok} because a record may not declare a
     * method that would collide with an implicit component accessor.
     */
    public static ActionResultDto okOnly() {
        return new ActionResultDto(true, null, null);
    }

    /** Complete / pack: {@code {"ok":true,"status":"..."}}. */
    public static ActionResultDto of(String status) {
        return new ActionResultDto(true, status, null);
    }

    /** Ship: adds the generated tracking id. */
    public static ActionResultDto shipped(String status, String trackingId) {
        return new ActionResultDto(true, status, trackingId);
    }
}
