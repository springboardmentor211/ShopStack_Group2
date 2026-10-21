package com.shopstack.customer.service;

import com.shopstack.customer.dto.CustomerResponseDTO;
import com.shopstack.customer.dto.CustomerUpdateRequest;
import com.shopstack.customer.entity.Customer;
import com.shopstack.customer.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    // Profile Details Get
    public CustomerResponseDTO getCustomerProfile(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        return mapToDTO(customer);
    }

    // Profile Update Karna
    public CustomerResponseDTO updateCustomerProfile(Long id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + id));

        if (request.getName() != null) customer.setName(request.getName());
        if (request.getPhone() != null) customer.setPhone(request.getPhone());
        if (request.getAddress() != null) customer.setAddress(request.getAddress());
        if (request.getCity() != null) customer.setCity(request.getCity());
        if (request.getPincode() != null) customer.setPincode(request.getPincode());

        Customer updatedCustomer = customerRepository.save(customer);
        return mapToDTO(updatedCustomer);
    }

    // Entity ko DTO me convert karne ke liye helper method
    private CustomerResponseDTO mapToDTO(Customer customer) {
        return CustomerResponseDTO.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .city(customer.getCity())
                .pincode(customer.getPincode())
                .build();
    }
}