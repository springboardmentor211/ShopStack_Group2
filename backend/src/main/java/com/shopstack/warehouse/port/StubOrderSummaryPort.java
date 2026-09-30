package com.shopstack.warehouse.port;

import com.shopstack.common.enums.OrderStatus;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

/**
 * Sprint 1 stub. The order module has no tables yet, so every count is zero.
 *
 * <p>Replaced by the real order-module implementation when that module lands.
 * Set {@code shopstack.warehouse.stub-ports=false} to disable it earlier.
 */
@Component
@ConditionalOnProperty(name = "shopstack.warehouse.stub-ports", havingValue = "true", matchIfMissing = true)
public class StubOrderSummaryPort implements OrderSummaryPort {

    @Override
    public Map<OrderStatus, Integer> countByWarehouseAndStatus(String warehouseId) {
        return Collections.emptyMap();
    }

    @Override
    public int countDueToday(String warehouseId) {
        return 0;
    }
}
