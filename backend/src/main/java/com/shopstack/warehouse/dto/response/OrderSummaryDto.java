package com.shopstack.warehouse.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record OrderSummaryDto(
        int dueToday,
        PipelineDto pipeline
) {
    public record PipelineDto(
            int pending,
            int confirmed,
            int picked,
            int packed,
            int shipped,
            @JsonProperty("out_for_delivery") int outForDelivery,
            int delivered
    ) {}
}
