package com.oneshop.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private Long userId;
    private List<OrderItemRequest> items;
}