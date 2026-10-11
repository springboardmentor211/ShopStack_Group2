package com.shopstack.product.dto;

import com.shopstack.review.dto.ReviewResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal oldPrice;
    private Double discount;
    private Double rating;
    private Integer totalReviews;
    private List<ReviewResponse> reviews;
    private Integer stockQuantity;
    private String category;
    private String imageUrl;
    private boolean active;
}