package com.shopstack.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRowDto {
    private String warehouseId;
    private String sku;
    private String zone;
    private String bin;
    private int qty;
    private String name;
    private String variant;
    private String category;
    private String vendorId;
    private String vendor;
    private Integer threshold;
    private String imageUrl;
}