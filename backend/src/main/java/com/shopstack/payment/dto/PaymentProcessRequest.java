package com.shopstack.payment.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentProcessRequest {

    @NotBlank(message = "Transaction ID is required")
    private String transactionId;

    private boolean success; // Mock flag: true = SUCCESS, false = FAILED
}