package com.shopstack.warehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InboundShipmentDto {
    private String id;
    private String warehouseId;
    private String vendorId;
    private String sku;
    private int qty;
    private String status;
    private String bin;
    private Instant arrivedAt;
    private Instant receivedAt;
    private String vendor;
    private VendorDetails vendorDetails;
    private ProductInfo product;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VendorDetails {
        private String shop;
        private String gstin;
        private String contact;
        private String phone;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductInfo {
        private String name;
        private String variant;
        private String category;
        private String imageUrl;
    }
}