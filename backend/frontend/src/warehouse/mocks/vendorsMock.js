export const mockVendors = [
  { id: 'VND-101', name: 'Abhijeet Enterprises', shop: 'Abhijeet Enterprises', gstin: '27ABCDE1234F1Z5', contact: 'Abhijeet', phone: '+91 98765 43210' },
  { id: 'VND-102', name: 'Nordic Works', shop: 'Nordic Works India LLP', gstin: '29AACCN5678L1ZQ', contact: 'Sara Lindqvist', phone: '+91 90040 88213' },
  { id: 'VND-103', name: 'Meridian Goods', shop: 'Meridian Goods Pvt. Ltd.', gstin: '27AAJCM1234K1Z9', contact: 'Rohit Malhotra', phone: '+91 98202 11456' },
  { id: 'VND-104', name: 'Coastal Supply', shop: 'Coastal Supply Traders', gstin: '33AAECC9988N1ZR', contact: 'Meera Iyer', phone: '+91 93800 12245' },
  { id: 'VND-105', name: 'Sahyadri Textiles', shop: 'Sahyadri Textiles & Exports', gstin: '27AAKCS7788P1ZT', contact: 'Vandana Kulkarni', phone: '+91 98220 61780' },
  { id: 'VND-106', name: 'Kaveri Crafts', shop: 'Kaveri Crafts Collective', gstin: '29AAHCK2345Q1Z2', contact: 'Arvind Rao', phone: '+91 94480 30215' },
];

export const vendorById = (id) => mockVendors.find((v) => v.id === id);
