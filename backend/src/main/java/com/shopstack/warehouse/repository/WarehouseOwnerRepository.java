package com.shopstack.warehouse.repository;

import com.shopstack.warehouse.entity.WarehouseOwner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WarehouseOwnerRepository extends JpaRepository<WarehouseOwner, Long> {

    Optional<WarehouseOwner> findByEmailIgnoreCase(String email);
}
