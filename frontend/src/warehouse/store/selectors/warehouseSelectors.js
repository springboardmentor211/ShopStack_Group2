import { createSelector } from '@reduxjs/toolkit';
import { stockStatus, summarizeBySku } from '../../services/inventoryService';
import { localIsoDate } from '../../utils/format';

export const ORDER_STAGES = ['pending', 'confirmed', 'picked', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

const selectInventoryItems = (state) => state.warehouse.inventory.items;
const selectInboundItems = (state) => state.warehouse.receiving.items;
const selectMovementItems = (state) => state.warehouse.movement.items;
const selectPipeline = (state) => state.warehouse.orderSummary.pipeline;
const selectDueToday = (state) => state.warehouse.orderSummary.dueToday;

const plural = (n, one, many) => (n === 1 ? one : many);

const statusOf = (summary) => stockStatus(summary.qty, summary.threshold);

export const selectSkuSummaries = createSelector([selectInventoryItems], summarizeBySku);

export const selectSkuStatusMap = createSelector([selectSkuSummaries], (summaries) =>
  summaries.reduce((acc, s) => {
    acc[s.sku] = statusOf(s);
    return acc;
  }, {})
);

export const selectStockGroups = createSelector([selectSkuSummaries], (summaries) => ({
  outOfStock: summaries.filter((s) => statusOf(s) === 'Out of Stock'),
  lowStock: summaries.filter((s) => statusOf(s) === 'Low Stock'),
}));

export const selectSidebarCounts = createSelector(
  [selectStockGroups, selectInboundItems],
  ({ outOfStock, lowStock }, inbound) => ({
    receiving: inbound.filter((a) => a.status === 'pending').length,
    inventory: outOfStock.length + lowStock.length,
  })
);

export const selectNotifications = createSelector(
  [selectStockGroups, selectInboundItems, selectPipeline],
  ({ outOfStock, lowStock }, inbound, pipeline) => {
    const alerts = [];
    const incoming = inbound.filter((a) => a.status === 'pending').length;
    const readyToPick = pipeline.confirmed || 0;

    if (outOfStock.length) {
      alerts.push({
        id: 'out-of-stock',
        text: `${outOfStock.length} ${plural(outOfStock.length, 'product is', 'products are')} out of stock.`,
        jump: { to: 'inventory', stock: 'Out of Stock' },
      });
    }
    if (lowStock.length) {
      alerts.push({
        id: 'low-stock',
        text: `${lowStock.length} ${plural(lowStock.length, 'product is', 'products are')} running low on stock.`,
        jump: { to: 'inventory', stock: 'Low Stock' },
      });
    }
    if (readyToPick) {
      alerts.push({
        id: 'ready-to-pick',
        text: `${readyToPick} ${plural(readyToPick, 'order is', 'orders are')} ready to pick.`,
        jump: { to: 'picking', tab: 'pick' },
      });
    }
    if (incoming) {
      alerts.push({
        id: 'incoming',
        text: `${incoming} ${plural(incoming, 'shipment has', 'shipments have')} arrived and need allocation.`,
        jump: { to: 'receiving' },
      });
    }
    return alerts;
  }
);

export const selectDashboard = createSelector(
  [selectInventoryItems, selectInboundItems, selectMovementItems, selectStockGroups, selectPipeline, selectDueToday],
  (inventory, inbound, movements, { outOfStock, lowStock }, pipeline, dueToday) => {
    const count = (stage) => pipeline[stage] || 0;
    const today = localIsoDate();
    const receivedToday = movements
      .filter((m) => m.type === 'Putaway' && localIsoDate(new Date(m.at)) === today)
      .reduce((sum, m) => sum + m.qty, 0);

    return {
      totalInventory: inventory.reduce((sum, item) => sum + item.qty, 0),
      receivedToday,
      outOfStock,
      lowStock,
      alertCount: outOfStock.length + lowStock.length,
      pendingShipments: count('packed'),
      dueToday,
      ordersToPick: count('confirmed'),
      queue: {
        ordersToConfirm: count('pending'),
        shipmentsToAllocate: inbound.filter((a) => a.status === 'pending').length,
        inPickOrPack: count('confirmed') + count('picked'),
        awaitingCarrier: count('packed'),
      },
      pipeline: ORDER_STAGES.reduce((acc, stage) => {
        acc[stage] = count(stage);
        return acc;
      }, {}),
    };
  }
);

export const selectBinZones = createSelector([(state) => state.warehouse.receiving.bins], (bins) => Object.keys(bins).sort());

export const selectInventoryCategories = createSelector([selectInventoryItems], (items) =>
  Array.from(new Set(items.map((i) => i.category))).sort()
);
