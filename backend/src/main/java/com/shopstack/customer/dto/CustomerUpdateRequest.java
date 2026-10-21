package com.shopstack.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerUpdateRequest {

    private String name;
    private String phone;
    private String address;
    private String city;
    private String pincode;
}