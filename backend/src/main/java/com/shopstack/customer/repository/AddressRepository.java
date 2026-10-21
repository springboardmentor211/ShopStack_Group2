package com.shopstack.customer.repository;

import com.shopstack.customer.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    // Particular customer ke saare addresses fetch karne ke liye
    List<Address> findByCustomerId(Long customerId);
}