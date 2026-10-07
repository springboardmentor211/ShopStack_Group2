const sampleOrders = [
  {
    id: 'ord-78421', orderNumber: 'S360-ORD-78421', status: 'PENDING', placedAt: '10:12',
    warehouse: 'North Hub', deliveryDate: '2026-10-02', paymentStatus: 'Verified',
    customer: { name: 'Priya Shah', city: 'Mumbai', address: '14 Marine Drive Apartments, Mumbai', phone: '+91 98200 41231' },
    items: [{ sku: 'S360-MOB-001', name: 'Shop360 Pro Smartphone', variant: 'Midnight black · 256 GB', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=180&q=80', tint: '#f1e6d6', bin: 'B-01-04', quantity: 1, stock: 32, vendorName: 'Nova Electronics' }],
  },
  {
    id: 'ord-78418', orderNumber: 'S360-ORD-78418', status: 'CONFIRMED', placedAt: '09:48',
    warehouse: 'North Hub', deliveryDate: '2026-10-01', paymentStatus: 'Verified',
    customer: { name: 'Rahul Mehta', city: 'Pune', address: '22 Koregaon Park, Pune', phone: '+91 98200 11842' },
    items: [{ sku: 'S360-ACC-016', name: 'Studio Wireless Headphones', variant: 'Plum · over-ear', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=180&q=80', tint: '#eadce5', bin: 'A-03-12', quantity: 1, stock: 18, vendorName: 'SoundHouse India' }],
  },
  {
    id: 'ord-78429', orderNumber: 'S360-ORD-78429', status: 'CONFIRMED', placedAt: '09:32',
    warehouse: 'North Hub', deliveryDate: '2026-10-01', paymentStatus: 'Verified',
    customer: { name: 'Kavya Rao', city: 'Bengaluru', address: '8th Cross, Indiranagar, Bengaluru', phone: '+91 98450 22017' },
    items: [
      { sku: 'S360-WEA-044', name: 'Everyday Runner', variant: 'Cloud grey · size 7', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=180&q=80', tint: '#e7e9e5', bin: 'C-02-07', quantity: 2, stock: 12, vendorName: 'Stride Works' },
      { sku: 'S360-ACC-102', name: 'Active Smartwatch', variant: 'Silver · 42 mm', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=180&q=80', tint: '#e6e4dc', bin: 'C-02-09', quantity: 1, stock: 7, vendorName: 'Nova Electronics' },
    ],
  },
  {
    id: 'ord-78425', orderNumber: 'S360-ORD-78425', status: 'PICKED', placedAt: '09:10',
    warehouse: 'North Hub', deliveryDate: '2026-10-02', paymentStatus: 'Verified',
    customer: { name: 'Sanjay Iyer', city: 'Delhi', address: '17 Vasant Vihar, New Delhi', phone: '+91 98110 33908' },
    items: [
      { sku: 'S360-MOB-001', name: 'Shop360 Pro Smartphone', variant: 'Midnight black · 256 GB', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=180&q=80', tint: '#f1e6d6', bin: 'B-01-04', quantity: 1, stock: 32, vendorName: 'Nova Electronics' },
      { sku: 'S360-ACC-016', name: 'Studio Wireless Headphones', variant: 'Plum · over-ear', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=180&q=80', tint: '#eadce5', bin: 'A-03-12', quantity: 1, stock: 18, vendorName: 'SoundHouse India' },
    ],
  },
  {
    id: 'ord-78416', orderNumber: 'S360-ORD-78416', status: 'PACKED', placedAt: '08:56', warehouse: 'North Hub', deliveryDate: '2026-10-01', paymentStatus: 'Verified',
    customer: { name: 'Ananya Desai', city: 'Mumbai', address: '31 Hill Road, Bandra West, Mumbai', phone: '+91 98201 64011' },
    items: [{ sku: 'S360-HOM-078', name: 'Arc Table Lamp', variant: 'Warm white · brass', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=180&q=80', tint: '#eee7d8', bin: 'D-04-02', quantity: 1, stock: 6, vendorName: 'Atelier Living' }],
  },
  {
    id: 'ord-78411', orderNumber: 'S360-ORD-78411', status: 'SHIPPED', placedAt: 'Yesterday', warehouse: 'North Hub', deliveryDate: '2026-09-30', paymentStatus: 'Verified',
    customer: { name: 'Arjun Nair', city: 'Chennai', address: '4 Cathedral Road, Chennai', phone: '+91 98400 77214' },
    items: [{ sku: 'S360-ACC-016', name: 'Studio Wireless Headphones', variant: 'Plum · over-ear', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=180&q=80', tint: '#eadce5', bin: 'A-03-12', quantity: 1, stock: 18, vendorName: 'SoundHouse India' }],
  },
  {
    id: 'ord-78406', orderNumber: 'S360-ORD-78406', status: 'OUT_FOR_DELIVERY', placedAt: 'Yesterday', warehouse: 'North Hub', deliveryDate: '2026-09-29', paymentStatus: 'Verified',
    customer: { name: 'Meera Joshi', city: 'Mumbai', address: '6 Juhu Tara Road, Mumbai', phone: '+91 98205 30918' },
    items: [{ sku: 'S360-WEA-044', name: 'Everyday Runner', variant: 'Cloud grey · size 7', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=180&q=80', tint: '#e7e9e5', bin: 'C-02-07', quantity: 1, stock: 12, vendorName: 'Stride Works' }],
  },
  {
    id: 'ord-78398', orderNumber: 'S360-ORD-78398', status: 'DELIVERED', placedAt: '28 Sep', warehouse: 'North Hub', deliveryDate: '2026-09-29', paymentStatus: 'Verified',
    customer: { name: 'Dev Malhotra', city: 'Pune', address: '10 Boat Club Road, Pune', phone: '+91 98222 40561' },
    items: [{ sku: 'S360-ACC-102', name: 'Active Smartwatch', variant: 'Silver · 42 mm', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=180&q=80', tint: '#e6e4dc', bin: 'C-02-09', quantity: 1, stock: 7, vendorName: 'Nova Electronics' }],
  },
]

let savedOrders = null

const copy = (value) => JSON.parse(JSON.stringify(value))

const normalizeOrders = (orders) =>
  orders.map((order) => ({
    ...order,
    items: order.items.map((item) => {
      const pickedQuantity = Number.isInteger(item.pickedQuantity)
        ? Math.max(0, Math.min(item.pickedQuantity, item.quantity))
        : item.picked ? item.quantity : 0
      return { ...item, pickedQuantity, picked: pickedQuantity === item.quantity }
    }),
  }))

export async function getWarehouseOrders() {
  if (savedOrders) return normalizeOrders(copy(savedOrders))
  return copy(sampleOrders)
}

export function saveWarehouseOrders(orders) {
  savedOrders = copy(orders)
  return true
}