package com.shopstack.warehouse.service;

import com.shopstack.warehouse.dto.response.InventoryRowDto;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.entity.WarehouseBin;
import com.shopstack.warehouse.port.ProductCataloguePort;
import com.shopstack.warehouse.port.VendorPort;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import com.shopstack.warehouse.repository.WarehouseBinRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryRowRepository inventoryRowRepository;
    private final WarehouseBinRepository warehouseBinRepository;
    private final ProductCataloguePort productCataloguePort;
    private final VendorPort vendorPort;

    public InventoryService(InventoryRowRepository inventoryRowRepository,
                            WarehouseBinRepository warehouseBinRepository,
                            ProductCataloguePort productCataloguePort,
                            VendorPort vendorPort) {
        this.inventoryRowRepository = inventoryRowRepository;
        this.warehouseBinRepository = warehouseBinRepository;
        this.productCataloguePort = productCataloguePort;
        this.vendorPort = vendorPort;
    }

    public List<InventoryRowDto> getInventory(String warehouseId) {
        List<InventoryRow> rows = inventoryRowRepository.findByWarehouseIdOrderByIdDesc(warehouseId);
        return rows.stream().map(this::toDto).toList();
    }

    public Map<String, List<String>> getBins(String warehouseId) {
        List<WarehouseBin> bins = warehouseBinRepository.findByWarehouseId(warehouseId);
        return bins.stream()
                .collect(Collectors.groupingBy(
                        WarehouseBin::getZone,
                        Collectors.mapping(WarehouseBin::getBinLabel, Collectors.toList())
                ));
    }

    private InventoryRowDto toDto(InventoryRow row) {
        ProductCataloguePort.ProductInfo product = productCataloguePort.findBySku(row.getSku());
        String vendorId = product == null ? null : product.vendorId();
        VendorPort.VendorInfo vendor = vendorId == null ? null : vendorPort.findById(vendorId);
        return new InventoryRowDto(
                row.getWarehouseId(),
                row.getSku(),
                row.getZone(),
                row.getBin(),
                row.getQty(),
                product == null ? null : product.name(),
                product == null ? null : product.variant(),
                product == null ? null : product.category(),
                vendorId,
                vendorName(vendor, vendorId),
                product == null ? null : product.threshold(),
                product == null ? null : product.imageUrl()
        );
    }

    private String vendorName(VendorPort.VendorInfo vendor, String vendorId) {
        if (vendor != null && vendor.name() != null) {
            return vendor.name();
        }
        return vendorId;
    }
}