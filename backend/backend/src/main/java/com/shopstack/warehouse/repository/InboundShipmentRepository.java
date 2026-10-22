package com.shopstack.warehouse.repository;

import com.shopstack.warehouse.entity.InboundShipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

@Repository
public interface InboundShipmentRepository extends JpaRepository<InboundShipment, String> {

    List<InboundShipment> findByWarehouseIdOrderByArrivedAtDesc(String warehouseId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM InboundShipment i WHERE i.id = :id")
    Optional<InboundShipment> findByIdWithLock(String id);
}