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