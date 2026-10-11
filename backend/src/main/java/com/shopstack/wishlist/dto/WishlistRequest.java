package com.shopstack.wishlist.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistRequest {

    // Filled in from the URL by the controller, so the client does not send it.
    private Long customerId;

    @NotNull(message = "Product ID is required")
    private Long productId;
}