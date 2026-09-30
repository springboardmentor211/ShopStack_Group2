package com.shopstack.warehouse.repository;

import com.shopstack.warehouse.entity.InventoryRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRowRepository extends JpaRepository<InventoryRow, Long> {

    List<InventoryRow> findByWarehouseId(String warehouseId);

    Optional<InventoryRow> findByWarehouseIdAndSkuAndBin(String warehouseId, String sku, String bin);

    @Modifying
    @Transactional
    @Query("DELETE FROM InventoryRow i WHERE i.warehouseId = :warehouseId AND i.sku = :sku AND i.bin <> :bin AND i.qty = 0")
    int deleteEmptyRowsInOtherBins(String warehouseId, String sku, String bin);
}