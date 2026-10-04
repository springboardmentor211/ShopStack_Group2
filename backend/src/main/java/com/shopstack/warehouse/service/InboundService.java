package com.shopstack.warehouse.service;

import com.shopstack.common.exception.ConflictException;
import com.shopstack.common.exception.ResourceNotFoundException;
import com.shopstack.common.exception.UnprocessableException;
import com.shopstack.common.util.IdGenerator;
import com.shopstack.warehouse.dto.response.InboundShipmentDto;
import com.shopstack.warehouse.entity.InboundShipment;
import com.shopstack.warehouse.entity.InventoryRow;
import com.shopstack.warehouse.entity.StockMovement;
import com.shopstack.warehouse.entity.Warehouse;
import com.shopstack.warehouse.entity.WarehouseBin;
import com.shopstack.warehouse.port.ProductCataloguePort;
import com.shopstack.warehouse.port.VendorPort;
import com.shopstack.warehouse.repository.InboundShipmentRepository;
import com.shopstack.warehouse.repository.InventoryRowRepository;
import com.shopstack.warehouse.repository.StockMovementRepository;
import com.shopstack.warehouse.repository.WarehouseBinRepository;
import com.shopstack.warehouse.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class InboundService {

    private static final String STATUS_PENDING = "pending";
    private static final String STATUS_RECEIVED = "received";

    private final InboundShipmentRepository inboundShipmentRepository;
    private final InventoryRowRepository inventoryRowRepository;
    private final StockMovementRepository stockMovementRepository;
    private final WarehouseBinRepository warehouseBinRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductCataloguePort productCataloguePort;
    private final VendorPort vendorPort;
    private final IdGenerator idGenerator;

    public InboundService(InboundShipmentRepository inboundShipmentRepository,
                          InventoryRowRepository inventoryRowRepository,
                          StockMovementRepository stockMovementRepository,
                          WarehouseBinRepository warehouseBinRepository,
                          WarehouseRepository warehouseRepository,
                          ProductCataloguePort productCataloguePort,
                          VendorPort vendorPort,
                          IdGenerator idGenerator) {
        this.inboundShipmentRepository = inboundShipmentRepository;
        this.inventoryRowRepository = inventoryRowRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.warehouseBinRepository = warehouseBinRepository;
        this.warehouseRepository = warehouseRepository;
        this.productCataloguePort = productCataloguePort;
        this.vendorPort = vendorPort;
        this.idGenerator = idGenerator;
    }

    public List<InboundShipmentDto> getInboundShipments(String warehouseId) {
        return inboundShipmentRepository.findByWarehouseIdOrderByArrivedAtDesc(warehouseId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public InboundShipmentDto receiveAsn(String warehouseId, String shipmentId, String bin) {
        InboundShipment shipment = inboundShipmentRepository
                .findByIdWithLock(shipmentId)
                .filter(s -> s.getWarehouseId().equals(warehouseId))
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found."));

        if (!STATUS_PENDING.equals(shipment.getStatus())) {
            throw new ConflictException("This shipment is already in inventory.");
        }

        ProductCataloguePort.ProductInfo product = productCataloguePort.findBySku(shipment.getSku());
        if (product == null) {
            throw new UnprocessableException("This product is not in the catalogue.");
        }

        if (bin == null || bin.isBlank()) {
            throw new UnprocessableException("Choose a valid bin for this warehouse.");
        }

        WarehouseBin warehouseBin = warehouseBinRepository
                .findByWarehouseIdAndBinLabel(warehouseId, bin)
                .orElseThrow(() -> new UnprocessableException("Choose a valid bin for this warehouse."));

        InventoryRow row = inventoryRowRepository
                .findByWarehouseIdAndSkuAndBin(warehouseId, shipment.getSku(), bin)
                .orElseGet(() -> InventoryRow.builder()
                        .warehouseId(warehouseId)
                        .sku(shipment.getSku())
                        .zone(warehouseBin.getZone())
                        .bin(bin)
                        .qty(0)
                        .build());
        row.setQty(row.getQty() + shipment.getQty());
        inventoryRowRepository.save(row);

        inventoryRowRepository.deleteEmptyRowsInOtherBins(warehouseId, shipment.getSku(), bin);

        shipment.setStatus(STATUS_RECEIVED);
        shipment.setBin(bin);
        shipment.setReceivedAt(Instant.now());
        inboundShipmentRepository.save(shipment);

        VendorPort.VendorInfo vendor = vendorPort.findById(shipment.getVendorId());
        String vendorName = vendor == null || vendor.name() == null ? shipment.getVendorId() : vendor.name();
        Warehouse warehouse = warehouseRepository.findById(warehouseId).orElse(null);
        String performedBy = warehouse == null ? null : warehouse.getOwnerName();

        stockMovementRepository.save(StockMovement.builder()
                .id(idGenerator.generateMovementId())
                .warehouseId(warehouseId)
                .sku(shipment.getSku())
                .type("Putaway")
                .fromLoc(vendorName)
                .toLoc(bin)
                .qty(shipment.getQty())
                .performedBy(performedBy)
                .at(Instant.now())
                .build());

        return toDto(shipment);
    }

    private InboundShipmentDto toDto(InboundShipment s) {
        VendorPort.VendorInfo vendor = vendorPort.findById(s.getVendorId());
        ProductCataloguePort.ProductInfo product = productCataloguePort.findBySku(s.getSku());

        return new InboundShipmentDto(
                s.getId(),
                s.getWarehouseId(),
                s.getVendorId(),
                s.getSku(),
                s.getQty(),
                s.getStatus(),
                s.getBin(),
                s.getArrivedAt(),
                s.getReceivedAt(),
                vendor == null || vendor.name() == null ? "Unknown vendor" : vendor.name(),
                vendor == null ? null : new InboundShipmentDto.VendorDetails(
                        vendor.shop(), vendor.gstin(), vendor.contact(), vendor.phone()),
                product == null ? null : new InboundShipmentDto.ProductInfo(
                        product.name(), product.variant(), product.category(), product.imageUrl())
        );
    }
}