package com.shopstack.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementDto {
    private String id;
    private String warehouseId;
    private Instant at;
    private String sku;
    private String type;
    private String from;
    private String to;
    private int qty;
    private String performedBy;
}