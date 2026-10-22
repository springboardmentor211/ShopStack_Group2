const IMG = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=300`;

export const mockCatalog = {
  'S360-MOB-001': { name: 'Shop360 Pro Smartphone', variant: 'Midnight Black · 256 GB', category: 'Electronics', vendorId: 'VND-101', threshold: 10, imageUrl: IMG('27596328') },
  'S360-AUD-002': { name: 'AirWave Wireless Headphones', variant: 'Pearl White', category: 'Electronics', vendorId: 'VND-101', threshold: 8, imageUrl: IMG('8038326') },
  'S360-LAP-003': { name: 'NovaBook Laptop', variant: 'Silver · 16 GB / 512 GB', category: 'Electronics', vendorId: 'VND-101', threshold: 5, imageUrl: IMG('25839642') },
  'S360-WAT-004': { name: 'PulseFit Smartwatch', variant: 'Graphite', category: 'Electronics', vendorId: 'VND-102', threshold: 8, imageUrl: IMG('3646165') },
  'S360-SHO-005': { name: 'Urban Runner Sneakers', variant: 'Grey · UK 8', category: 'Fashion', vendorId: 'VND-103', threshold: 10, imageUrl: IMG('26852035') },
  'S360-FAS-006': { name: 'Linen Overshirt', variant: 'Sand · M', category: 'Fashion', vendorId: 'VND-105', threshold: 7, imageUrl: IMG('22441291') },
  'S360-HOM-007': { name: 'BrewMaster Blender', variant: 'Cream · 750W', category: 'Home & Kitchen', vendorId: 'VND-106', threshold: 6, imageUrl: IMG('30946794') },
  'S360-BEA-008': { name: 'GlowCare Face Serum', variant: '30 ml', category: 'Beauty & Personal Care', vendorId: 'VND-104', threshold: 12, imageUrl: IMG('20377674') },
};
