package com.shopstack.auth.dto;

public record WarehouseProfileDto(
        String warehouseId,
        String warehouseName,
        String city,
        String ownerName,
        String role
) {
}
