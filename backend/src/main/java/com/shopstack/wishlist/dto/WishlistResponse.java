package com.shopstack.wishlist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistResponse {

    private Long id;
    private Long customerId;
    private Long productId;
    private String productName;
    private BigDecimal productPrice;
    private String productImage;
    private LocalDateTime createdAt;
}