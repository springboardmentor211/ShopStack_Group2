package com.shopstack.warehouse.service;

import com.shopstack.warehouse.dto.response.StockMovementDto;
import com.shopstack.warehouse.entity.StockMovement;
import com.shopstack.warehouse.repository.StockMovementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovementService {

    private final StockMovementRepository stockMovementRepository;

    public MovementService(StockMovementRepository stockMovementRepository) {
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<StockMovementDto> getMovements(String warehouseId) {
        List<StockMovement> movements = stockMovementRepository.findByWarehouseIdOrderByAtDesc(warehouseId);
        return movements.stream().map(this::toDto).toList();
    }

    private StockMovementDto toDto(StockMovement m) {
        return new StockMovementDto(
                m.getId(),
                m.getWarehouseId(),
                m.getAt(),
                m.getSku(),
                m.getType(),
                m.getFromLoc(),
                m.getToLoc(),
                m.getQty(),
                m.getPerformedBy()
        );
    }
}