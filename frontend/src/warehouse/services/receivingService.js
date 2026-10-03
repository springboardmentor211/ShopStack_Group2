import { USE_MOCK } from './config';
import { apiRequest, jsonPost } from './http';
import { clone, wait } from './mockUtils';
import { addMockMovement } from './movementService';
import { mockInbound } from '../mocks/inboundMock';
import { mockInventory } from '../mocks/inventoryMock';
import { mockCatalog } from '../mocks/catalogMock';
import { mockBins } from '../mocks/binsMock';
import { mockWarehouses } from '../mocks/authMock';
import { vendorById } from '../mocks/vendorsMock';

const toRow = (asn) => {
  const vendor = vendorById(asn.vendorId);
  const product = mockCatalog[asn.sku];
  return {
    ...asn,
    vendor: vendor?.name || 'Unknown vendor',
    vendorDetails: vendor
      ? { shop: vendor.shop, gstin: vendor.gstin, contact: vendor.contact, phone: vendor.phone }
      : null,
    product: product
      ? { name: product.name, variant: product.variant, category: product.category, imageUrl: product.imageUrl }
      : null,
  };
};

export async function getInboundShipments(warehouseId) {
  if (USE_MOCK) {
    await wait();
    return clone(
      mockInbound
        .filter((a) => a.warehouseId === warehouseId)
        .sort((a, b) => new Date(b.arrivedAt) - new Date(a.arrivedAt))
        .map(toRow)
    );
  }

  return apiRequest(`/api/warehouses/${warehouseId}/inbound`);
}

export async function getBins(warehouseId) {
  if (USE_MOCK) {
    await wait(100);
    return clone(mockBins[warehouseId] || {});
  }

  return apiRequest(`/api/warehouses/${warehouseId}/bins`);
}

export async function receiveAsn(warehouseId, id, bin) {
  if (USE_MOCK) {
    await wait(300);

    const asn = mockInbound.find((a) => a.id === id && a.warehouseId === warehouseId);
    if (!asn) throw new Error('Shipment not found.');
    if (asn.status !== 'pending') throw new Error('This shipment is already in inventory.');

    const product = mockCatalog[asn.sku];
    if (!product) throw new Error('This product is not in the catalogue.');

    const zones = mockBins[warehouseId] || {};
    const zone = Object.keys(zones).find((z) => zones[z].includes(bin));
    if (!bin || !zone) throw new Error('Choose a valid bin for this warehouse.');

    let row = mockInventory.find((i) => i.warehouseId === warehouseId && i.sku === asn.sku && i.bin === bin);
    if (!row) {
      row = { warehouseId, sku: asn.sku, zone, bin, qty: 0, ...product };
      mockInventory.push(row);
    }
    row.qty += asn.qty;

    mockInventory
      .filter((i) => i.warehouseId === warehouseId && i.sku === asn.sku && i.bin !== bin && i.qty === 0)
      .forEach((i) => mockInventory.splice(mockInventory.indexOf(i), 1));

    const owner = mockWarehouses.find((w) => w.id === warehouseId)?.ownerName || 'Warehouse owner';
    const vendor = vendorById(asn.vendorId);

    asn.status = 'received';
    asn.bin = bin;
    asn.receivedAt = new Date().toISOString();

    addMockMovement({
      warehouseId,
      sku: asn.sku,
      type: 'Putaway',
      from: vendor?.name || 'Vendor',
      to: bin,
      qty: asn.qty,
      performedBy: owner,
    });

    return clone(toRow(asn));
  }

  return apiRequest(`/api/warehouses/${warehouseId}/inbound/${id}/receive`, jsonPost({ bin }));
}
