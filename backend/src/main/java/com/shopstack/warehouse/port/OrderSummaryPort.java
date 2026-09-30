package com.shopstack.warehouse.port;

import com.shopstack.common.enums.OrderStatus;

import java.util.Map;

/**
 * Defined by the warehouse team, implemented by the order module.
 */
public interface OrderSummaryPort {

    Map<OrderStatus, Integer> countByWarehouseAndStatus(String warehouseId);

    int countDueToday(String warehouseId);
}
