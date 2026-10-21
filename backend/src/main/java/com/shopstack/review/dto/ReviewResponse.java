package com.shopstack.review.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {

    private Long id;
    private Long customerId;
    private String customerName;
    private Long productId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
