import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Archive,
  DollarSign,
  BarChart3,
  User,
  Settings,
  HelpCircle,
  Search,
  X,
  Bell,
  SlidersHorizontal,
  Clock,
  ChevronDown,
  Eye,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Laptop,
  Headphones,
  Smartphone,
  Tablet,
  Mouse
} from 'lucide-react';
import ShopSphereLogo from '../../components/Logo';
import '../../styles/vendor.css';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reportExported, setReportExported] = useState(false);

  // Sample data matching the screenshot mockups exactly
  const topProducts = [
    { id: 1, name: 'MacBook Pro 14', category: 'Laptops', revenue: '$12,400', icon: Laptop },
    { id: 2, name: 'Sony WH-1000XM5', category: 'Audio', revenue: '$8,750', icon: Headphones },
    { id: 3, name: 'Samsung Galaxy S24', category: 'Phones', revenue: '$7,200', icon: Smartphone },
    { id: 4, name: 'iPad Air M2', category: 'Tablets', revenue: '$5,890', icon: Tablet },
    { id: 5, name: 'Logitech MX Master', category: 'Accessories', revenue: '$3,450', icon: Mouse }
  ];

  const recentOrders = [
    { id: '#SS-2847', customer: 'Aditi P.', product: 'Electronic Device', items: 1, amount: '$1,280.00', status: 'Delivered', date: '2026-09-07' },
    { id: '#SS-2846', customer: 'Karan M.', product: 'Electronic Device', items: 2, amount: '$450.00', status: 'Pending', date: '2026-09-07' },
    { id: '#SS-2845', customer: 'Neha S.', product: 'Electronic Device', items: 1, amount: '$320.00', status: 'Processing', date: '2026-09-06' },
    { id: '#SS-2844', customer: 'Rahul V.', product: 'Electronic Device', items: 3, amount: '$150.00', status: 'Paid', date: '2026-09-06' },
    { id: '#SS-2843', customer: 'Pooja K.', product: 'Electronic Device', items: 1, amount: '$1,100.00', status: 'Confirmed', date: '2026-09-05' },
    { id: '#SS-2842', customer: 'Amit R.', product: 'Electronic Device', items: 2, amount: '$85.00', status: 'Cancelled', date: '2026-09-05' }
  ];

  const activities = [
    { id: 1, title: 'New order #SS-2847 received', time: '10 mins ago', color: '#3b82f6' },
    { id: 2, title: 'Product ASUS Laptop approved', time: '1 hour ago', color: '#22c55e' },
    { id: 3, title: 'Payment of $1,280 settled', time: '3 hours ago', color: '#3b82f6' },
    { id: 4, title: 'Low stock alert: Wireless Mouse', time: '5 hours ago', color: '#ef4444' }
  ];

  // Filter orders based on search query
  const filteredOrders = recentOrders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = topProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'paid':
        return 'status-paid';
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-processing';
    }
  };

  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  return (
    <div className="vendor-layout">
      {/* Sidebar Navigation */}
      <aside className="vendor-sidebar">
        <div className="sidebar-top">
          {/* Brand Logo */}
          <div className="brand-logo" style={{ padding: '0.25rem 0' }}>
            <ShopSphereLogo size={36} showText={true} />
          </div>

          {/* Vendor Shop Info Card */}
          <div className="vendor-shop-card">
            <div className="vendor-shop-name">TechVault Electronics</div>
            <div className="vendor-shop-email">vendor@techvault.com</div>
          </div>

          {/* Main Navigation Links */}
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('Dashboard')}
            >
              <LayoutDashboard className="nav-item-icon" />
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'Products' ? 'active' : ''}`}
              onClick={() => setActiveTab('Products')}
            >
              <Package className="nav-item-icon" />
              <span>Products</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'Orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('Orders')}
            >
              <ShoppingCart className="nav-item-icon" />
              <span>Orders</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'Inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('Inventory')}
            >
              <Archive className="nav-item-icon" />
              <span>Inventory</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'Pricing' ? 'active' : ''}`}
              onClick={() => setActiveTab('Pricing')}
            >
              <DollarSign className="nav-item-icon" />
              <span>Pricing</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'Analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('Analytics')}
            >
              <BarChart3 className="nav-item-icon" />
              <span>Analytics</span>
            </button>

            {/* Account Section */}
            <div className="nav-section-label">ACCOUNT</div>
            <button
              className={`nav-item ${activeTab === 'Profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('Profile')}
            >
              <User className="nav-item-icon" />
              <span>Profile</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('Settings')}
            >
              <Settings className="nav-item-icon" />
              <span>Settings</span>
            </button>
            <button
              className={`nav-item ${activeTab === 'Help' ? 'active' : ''}`}
              onClick={() => setActiveTab('Help')}
            >
              <HelpCircle className="nav-item-icon" />
              <span>Help</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="sidebar-footer">
          <div className="user-avatar-circle">RK</div>
          <div className="user-info">
            <span className="user-name">Rajesh Kumar</span>
            <span className="user-role">Vendor</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="vendor-main">
        {/* Top Header */}
        <header className="vendor-header">
          <div>
            <h1 className="header-greeting-title">Good morning, Rajesh!</h1>
            <p className="header-greeting-subtitle">Here's what's happening with your store today.</p>
          </div>

          <div className="header-actions">
            {/* Search Input Box */}
            <div className="search-box-wrapper">
              <Search className="search-icon-left" />
              <input
                type="text"
                className="search-input"
                placeholder="Search orders, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Notification Button */}
            <button
              className="header-icon-btn"
              title="Notifications"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={18} />
              <span className="notification-badge" />
            </button>

            {/* Settings Quick Action */}
            <button className="header-icon-btn" title="Preferences">
              <SlidersHorizontal size={18} />
            </button>

            {/* User Avatar Header */}
            <div className="header-user-avatar" title="Rajesh Kumar">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="dashboard-content">
          {/* Notification Alert Banner if toggled */}
          {notificationsOpen && (
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '0.875rem 1.25rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#1e40af',
                fontSize: '0.875rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={16} />
                <span>You have 4 new notifications: Order #SS-2847 received, payout settled.</span>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: '#1e40af' }}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Export Toast Alert */}
          {reportExported && (
            <div
              style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                padding: '0.875rem 1.25rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#166534',
                fontSize: '0.875rem'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Report downloaded successfully (Vendor_Sales_Q3.csv)</span>
            </div>
          )}

          {/* Top Metrics Grid (4 Cards) */}
          <section className="metrics-grid">
            {/* Card 1: Total Revenue */}
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Revenue</span>
                <div className="metric-icon-badge badge-blue">
                  <DollarSign size={18} />
                </div>
              </div>
              <div className="metric-value">$45,280</div>
              <div className="metric-trend trend-positive">
                <ArrowUpRight size={14} />
                <span>+12.5% vs last month</span>
              </div>
            </div>

            {/* Card 2: Total Orders */}
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Orders</span>
                <div className="metric-icon-badge badge-green">
                  <ShoppingCart size={18} />
                </div>
              </div>
              <div className="metric-value">1,247</div>
              <div className="metric-trend trend-positive">
                <ArrowUpRight size={14} />
                <span>+8.3% vs last month</span>
              </div>
            </div>

            {/* Card 3: Total Products */}
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Products</span>
                <div className="metric-icon-badge badge-orange">
                  <Package size={18} />
                </div>
              </div>
              <div className="metric-value">186</div>
              <div className="metric-trend trend-negative">
                <ArrowDownRight size={14} />
                <span>-2.1% vs last month</span>
              </div>
            </div>

            {/* Card 4: Pending Approval */}
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Pending Approval</span>
                <div className="metric-icon-badge badge-yellow">
                  <Clock size={18} />
                </div>
              </div>
              <div className="metric-value">12</div>
              <div className="metric-trend trend-neutral">
                <span>Needs review</span>
              </div>
            </div>
          </section>

          {/* Middle Row Grid (Revenue Report + Recent Activity) */}
          <section className="middle-grid">
            {/* Revenue Report Chart Box */}
            <div className="widget-card">
              <div className="widget-header">
                <div>
                  <h2 className="widget-title">Revenue Report</h2>
                  <p className="widget-subtitle">Interactive view of earnings and operational costs</p>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot dot-earnings" />
                    <span>Earnings</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot dot-invested" />
                    <span>Invested</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot dot-expenses" />
                    <span>Expenses</span>
                  </div>
                </div>
              </div>

              {/* Vector SVG Line Chart */}
              <div className="chart-svg-container">
                <svg viewBox="0 0 600 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="60" x2="580" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="100" x2="580" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="140" x2="580" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="40" y1="180" x2="580" y2="180" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Y-Axis Labels */}
                  <text x="25" y="24" fontSize="10" fill="#94a3b8" textAnchor="end">$50k</text>
                  <text x="25" y="64" fontSize="10" fill="#94a3b8" textAnchor="end">$37.5k</text>
                  <text x="25" y="104" fontSize="10" fill="#94a3b8" textAnchor="end">$25k</text>
                  <text x="25" y="144" fontSize="10" fill="#94a3b8" textAnchor="end">$12.5k</text>
                  <text x="25" y="184" fontSize="10" fill="#94a3b8" textAnchor="end">$0</text>

                  {/* X-Axis Labels */}
                  <text x="60" y="198" fontSize="11" fill="#64748b" textAnchor="middle">Jan</text>
                  <text x="160" y="198" fontSize="11" fill="#64748b" textAnchor="middle">Feb</text>
                  <text x="260" y="198" fontSize="11" fill="#64748b" textAnchor="middle">Mar</text>
                  <text x="360" y="198" fontSize="11" fill="#64748b" textAnchor="middle">Apr</text>
                  <text x="460" y="198" fontSize="11" fill="#64748b" textAnchor="middle">May</text>
                  <text x="560" y="198" fontSize="11" fill="#64748b" textAnchor="middle">Jun</text>

                  {/* Line 3: Expenses (Light Blue) */}
                  <path
                    d="M 60,150 C 120,140 160,135 260,130 C 360,138 460,125 560,115"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="2.5"
                  />

                  {/* Line 2: Invested (Green) */}
                  <path
                    d="M 60,135 C 120,130 160,110 260,95 C 360,110 460,90 560,75"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="2.5"
                  />

                  {/* Line 1: Earnings (Blue) */}
                  <path
                    d="M 60,120 C 120,105 160,95 260,50 C 360,90 460,65 560,40"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                  />

                  {/* Highlight Tooltip on Mar peak ($38.5k Earnings) */}
                  <circle cx="260" cy="50" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                  <g transform="translate(200, 20)">
                    <rect x="0" y="0" width="115" height="24" rx="6" fill="#0f172a" />
                    <text x="57" y="16" fontSize="11" fontWeight="600" fill="#ffffff" textAnchor="middle">
                      $38.5k Earnings
                    </text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Recent Activity List Box */}
            <div className="widget-card">
              <div className="widget-header">
                <h2 className="widget-title">Recent Activity</h2>
              </div>
              <div className="activity-list">
                {activities.map((act) => (
                  <div key={act.id} className="activity-item">
                    <div className="activity-left">
                      <span className="activity-dot" style={{ backgroundColor: act.color }} />
                      <span className="activity-text">{act.title}</span>
                    </div>
                    <span className="activity-time">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Row Grid (Top Performing Products + Recent Orders Table) */}
          <section className="bottom-grid">
            {/* Top Performing Products Card */}
            <div className="widget-card">
              <div className="widget-header">
                <h2 className="widget-title">Top Performing Products</h2>
                <button className="action-link-btn" onClick={handleExportReport}>
                  <span>Export Report</span>
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="products-list">
                {filteredProducts.map((p) => {
                  const IconComp = p.icon;
                  return (
                    <div key={p.id} className="product-item">
                      <div className="product-info-group">
                        <div className="product-img-box">
                          <IconComp size={20} />
                        </div>
                        <div>
                          <div className="product-name">{p.name}</div>
                          <div className="product-category">{p.category}</div>
                        </div>
                      </div>
                      <div className="product-revenue">{p.revenue}</div>
                    </div>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0', fontSize: '0.875rem' }}>
                    No products match "{searchQuery}"
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders Table Card */}
            <div className="widget-card">
              <div className="widget-header">
                <h2 className="widget-title">Recent Orders</h2>
                <button className="btn-primary-sm" onClick={handleExportReport}>
                  Generate Report
                </button>
              </div>

              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="order-id-cell">{ord.id}</td>
                        <td>{ord.customer}</td>
                        <td>{ord.product}</td>
                        <td>{ord.items}</td>
                        <td style={{ fontWeight: 600 }}>{ord.amount}</td>
                        <td>
                          <span className={`status-badge ${getStatusBadgeClass(ord.status)}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="table-action-icon"
                              title="View Details"
                              onClick={() => setSelectedOrder(ord)}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              className="table-action-icon"
                              title="Download Invoice"
                              onClick={handleExportReport}
                            >
                              <Download size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', color: '#64748b', padding: '2rem 0' }}>
                          No orders found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer & Pagination */}
              <div className="table-footer">
                <div>Showing 1-6 of 24 orders</div>
                <div className="pagination-controls">
                  <button className="page-btn">Previous</button>
                  <button className="page-btn active">01</button>
                  <button className="page-btn">Next</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Order Details - {selectedOrder.id}</h3>
              <button className="close-modal-btn" onClick={() => setSelectedOrder(null)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div><strong>Customer Name:</strong> {selectedOrder.customer}</div>
              <div><strong>Item Description:</strong> {selectedOrder.product}</div>
              <div><strong>Quantity:</strong> {selectedOrder.items} unit(s)</div>
              <div><strong>Total Amount:</strong> {selectedOrder.amount}</div>
              <div>
                <strong>Current Status:</strong>{' '}
                <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <div><strong>Order Date:</strong> {selectedOrder.date}</div>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  className="btn-primary-sm"
                  onClick={() => {
                    handleExportReport();
                    setSelectedOrder(null);
                  }}
                >
                  Download Invoice PDF
                </button>
                <button
                  className="btn-primary-sm"
                  style={{ backgroundColor: '#2563eb', color: '#ffffff', borderColor: '#2563eb' }}
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
