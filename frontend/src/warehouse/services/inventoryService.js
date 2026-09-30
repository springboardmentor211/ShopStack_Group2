import { USE_MOCK } from './config';
import { apiRequest } from './http';
import { clone, wait } from './mockUtils';
import { mockInventory } from '../mocks/inventoryMock';
import { vendorById } from '../mocks/vendorsMock';

export const CAT_TINT = {
  Electronics: ['bg-[#E6EDF3]', 'text-[#3F5F80]'],
  Fashion: ['bg-[#F1E7EF]', 'text-[#6E4E8F]'],
  'Home & Kitchen': ['bg-[#F6EBDD]', 'text-[#8F6739]'],
  'Beauty & Personal Care': ['bg-[#EEE8DA]', 'text-[#7A6A45]'],
};

export const DEFAULT_TINT = ['bg-[#F6EBDD]', 'text-[#8F6739]'];

export const tintFor = (category) => CAT_TINT[category] || DEFAULT_TINT;

export function stockStatus(qty, threshold) {
  if (qty === 0) return 'Out of Stock';
  if (qty <= threshold) return 'Low Stock';
  return 'In Stock';
}

export function summarizeBySku(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const entry = map.get(row.sku) || {
      sku: row.sku,
      name: row.name,
      variant: row.variant,
      category: row.category,
      vendor: row.vendor,
      imageUrl: row.imageUrl,
      threshold: row.threshold,
      qty: 0,
      stockedBins: [],
      allBins: [],
    };
    entry.qty += row.qty;
    entry.allBins.push(row.bin);
    if (row.qty > 0) entry.stockedBins.push(row.bin);
    map.set(row.sku, entry);
  });
  return Array.from(map.values()).map(({ stockedBins, allBins, ...rest }) => ({
    ...rest,
    bins: stockedBins.length ? stockedBins : allBins,
  }));
}

const toRow = (item) => ({
  ...item,
  vendor: vendorById(item.vendorId)?.name || 'Unknown vendor',
});

export async function getInventory(warehouseId) {
  if (USE_MOCK) {
    await wait();
    return clone(mockInventory.filter((item) => item.warehouseId === warehouseId).map(toRow));
  }

  return apiRequest(`/api/warehouses/${warehouseId}/inventory`);
}
