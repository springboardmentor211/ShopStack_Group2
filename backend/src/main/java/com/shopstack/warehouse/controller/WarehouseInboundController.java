package com.shopstack.warehouse.controller;

import com.shopstack.warehouse.dto.request.ReceiveAsnRequest;
import com.shopstack.warehouse.dto.response.InboundShipmentDto;
import com.shopstack.warehouse.service.InboundService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseInboundController {

    private final InboundService inboundService;

    public WarehouseInboundController(InboundService inboundService) {
        this.inboundService = inboundService;
    }

    @GetMapping("/{warehouseId}/inbound")
    public List<InboundShipmentDto> getInboundShipments(@PathVariable String warehouseId) {
        return inboundService.getInboundShipments(warehouseId);
    }

    @PostMapping("/{warehouseId}/inbound/{id}/receive")
    public InboundShipmentDto receiveAsn(@PathVariable String warehouseId,
                                         @PathVariable String id,
                                         @Valid @RequestBody ReceiveAsnRequest request) {
        return inboundService.receiveAsn(warehouseId, id, request.getBin());
    }
}