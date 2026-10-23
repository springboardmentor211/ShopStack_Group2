package com.shopstack.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {

    private Long id;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private String addressType;
    private boolean isDefault;
}