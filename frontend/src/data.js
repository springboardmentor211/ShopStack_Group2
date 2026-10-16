// Shared mock data for ShopStack vendor pages.
// Replace this data with API responses when the backend is ready.

//Dashboard
export const dashboardData = {
  vendorName: "Vendor",

  summary: {
    totalRevenue: "₹1,24,580",
    revenueChange: "↑ 18.4% from last week",
    totalOrders: "186",
    ordersChange: "↑ 12.1% from last week",
    productsListed: "4",
    productsDescription: "Active catalogue items",
    lowStockItems: "2",
    lowStockDescription: "Need your attention",
  },

  revenue: {
    currentWeek: "₹1,24,580",
    chartData: [
      { day: "Mon", value: 4500 },
      { day: "Tue", value: 6500 },
      { day: "Wed", value: 5200 },
      { day: "Thu", value: 7200 },
      { day: "Fri", value: 5800 },
      { day: "Sat", value: 7200 },
      { day: "Sun", value: 6800 },
    ],
  },
};

export const recentOrders = [
  {
    id: "#SH360-1842",
    customer: "Aarav Mehta",
    date: "18 Sep 2026",
    amount: "₹8,450",
    status: "Delivered",
  },
  {
    id: "#SH360-1841",
    customer: "Kavya Iyer",
    date: "18 Sep 2026",
    amount: "₹2,199",
    status: "Processing",
  },
  {
    id: "#SH360-1840",
    customer: "Rohan Kapoor",
    date: "17 Sep 2026",
    amount: "₹5,799",
    status: "Delivered",
  },
  {
    id: "#SH360-1839",
    customer: "Nisha Sharma",
    date: "17 Sep 2026",
    amount: "₹3,650",
    status: "Shipped",
  },
];

export const lowStockProducts = [
  {
    name: "Organic Cotton Kurta",
    sku: "NF-KRT-OLV-M",
    unitsLeft: 3,
  },
  {
    name: "Brass Table Lamp",
    sku: "NF-LMP-BRS-01",
    unitsLeft: 5,
  },
];

//Coupons

export const initialCoupons = [
  {
    id: 1,
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    used: 42,
    minimumOrder: 500,
    maximumDiscount: 500,
    usageLimit: 100,
    startDate: "2026-09-01",
    endDate: "2026-12-31",
  },
  {
    id: 2,
    code: "FESTIVE500",
    type: "Flat Discount",
    value: 500,
    used: 28,
    minimumOrder: 2000,
    maximumDiscount: 500,
    usageLimit: 100,
    startDate: "2026-09-15",
    endDate: "2026-11-30",
  },
  {
    id: 3,
    code: "NEWUSER20",
    type: "Percentage",
    value: 20,
    used: 16,
    minimumOrder: 1000,
    maximumDiscount: 1000,
    usageLimit: 100,
    startDate: "2026-11-01",
    endDate: "2026-12-31",
  },
];

//Setting

export const defaultProfile = {
  storeName: "North & Form Store",
  vendorName: "Vendor",
  email: "vendor@shopstack.com",
  phone: "+91 98765 43210",
};

export const defaultPreferences = {
  storeStatus: true,
  orderNotifications: true,
  lowStockAlerts: true,
};

export const defaultNotifications = {
  newOrders: true,
  orderUpdates: true,
  lowStock: true,
  warehouseUpdates: true,
};

// Combined settings data for use wherever needed.
export const initialSettings = {
  ...defaultPreferences,
  ...defaultNotifications,
};

//start from here for your mock data

 // Vendor Products page mock data
export const initialProducts = [
  {
    id: 1,
    name: "Organic Cotton Kurta",
    sku: "NF-KRT-OLV-M",
    category: "Clothing",
    price: 1499,
    stock: 25,
    status: "Active",
  },
  {
    id: 2,
    name: "Brass Table Lamp",
    sku: "NF-LMP-BRS-01",
    category: "Home Decor",
    price: 2499,
    stock: 5,
    status: "Active",
  },
  {
    id: 3,
    name: "Linen Shirt",
    sku: "NF-SHT-LIN-L",
    category: "Clothing",
    price: 999,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Ceramic Vase",
    sku: "NF-VAS-CRM-01",
    category: "Home Decor",
    price: 799,
    stock: 18,
    status: "Active",
  },
];

// Vendor Orders page mock data
export const initialOrders = [
  {
    id: "#ORD-1024",
    customer: "Ananya Rao",
    product: "Heritage Portable Speaker",
    date: "18 Sep 2026",
    total: 7499,
    status: "Processing",
  },
  {
    id: "#ORD-1023",
    customer: "Rahul Kumar",
    product: "Wireless Headphones",
    date: "18 Sep 2026",
    total: 3999,
    status: "Shipped",
  },
  {
    id: "#ORD-1022",
    customer: "Sneha Reddy",
    product: "Smart Watch",
    date: "17 Sep 2026",
    total: 5499,
    status: "Delivered",
  },
  {
    id: "#ORD-1021",
    customer: "Arjun Patel",
    product: "Bluetooth Speaker",
    date: "17 Sep 2026",
    total: 2499,
    status: "Pending",
  },
  {
    id: "#ORD-1020",
    customer: "Priya Sharma",
    product: "USB-C Hub",
    date: "16 Sep 2026",
    total: 1899,
    status: "Delivered",
  },
];
// Inventory sample data


//Analytics sample data

export const graphData = {
  "7": {
    labels: ["Sep 30", "Oct 01", "Oct 02", "Oct 03", "Oct 04", "Oct 05", "Oct 06"],
    values: [1800, 2400, 2100, 3200, 2800, 4100, 4600]
  },
  "30": {
    labels: ["Aug 21", "Aug 28", "Sep 04", "Sep 11", "Sep 19"],
    values: [700, 2600, 4200, 5200, 5900]
  },
  "90": {
    labels: ["Jul 01", "Jul 15", "Aug 01", "Aug 15", "Sep 01", "Sep 15", "Oct 01"],
    values: [1200, 1800, 2500, 3200, 4100, 5000, 5900]
  }
};

export const topProducts = [
  ["Heritage Portable Speaker", 86],
  ["Wireless Headphones", 72],
  ["Smart Watch", 54],
  ["Bluetooth Speaker", 41]
];

export const orderPerformance = [
  { label: "Completed", count: 180, width: "80%" },
  { label: "Processing", count: 28, width: "12%" },
  { label: "Shipped", count: 25, width: "10%" },
  { label: "Pending", count: 15, width: "7%" }
];
