import { useEffect, useState } from 'react'
import {
	AlertTriangle, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight,
	Clock3, CreditCard, MapPin, MoreHorizontal, Package, PackageOpen, Phone,
	Search, Send, X,
} from 'lucide-react'
import { getWarehouseOrders, saveWarehouseOrders } from './warehouse/services/orderDeskService.js'
import FulfillmentPage from './warehouse/pages/FulfillmentPage.jsx'
import './App.css'

const statuses = [
	{ id: 'ALL', label: 'All' },
	{ id: 'PENDING', label: 'Pending' },
	{ id: 'CONFIRMED', label: 'Confirmed' },
	{ id: 'PICKED', label: 'Picked' },
	{ id: 'PACKED', label: 'Packed' },
	{ id: 'SHIPPED', label: 'Shipped' },
	{ id: 'OUT_FOR_DELIVERY', label: 'Out for delivery' },
	{ id: 'DELIVERED', label: 'Delivered' },
	{ id: 'CANCELLED', label: 'Cancelled' },
]
const progressStatuses = statuses.slice(1, 8)
const statusLabels = Object.fromEntries(statuses.slice(1).map(({ id, label }) => [id, label]))
const nextStatus = {
	PENDING: 'CONFIRMED', CONFIRMED: 'PICKED', PICKED: 'PACKED', PACKED: 'SHIPPED',
	SHIPPED: 'OUT_FOR_DELIVERY', OUT_FOR_DELIVERY: 'DELIVERED',
}
const pageSize = 4

function formatDate(date) {
	if (!date) return 'Not set'
	return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`))
}

function formatUnits(count) {
	return `${count} ${count === 1 ? 'unit' : 'units'}`
}

function ProductThumb({ item, compact = false }) {
	return (
		<span className={`product-thumb${compact ? ' product-thumb--compact' : ''}`} style={{ '--thumb-bg': item.tint }}>
			<Package className="product-thumb__fallback" aria-hidden="true" />
			<img src={item.image} alt="" onError={(event) => { event.currentTarget.hidden = true }} />
		</span>
	)
}

function StatusBadge({ status }) {
	return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{statusLabels[status]}</span>
}

function App() {
	const [orders, setOrders] = useState([])
	const [activeView, setActiveView] = useState('fulfillment')
	const [selectedId, setSelectedId] = useState('')
	const [activeStatus, setActiveStatus] = useState('ALL')
	const [search, setSearch] = useState('')
	const [page, setPage] = useState(0)
	const [toast, setToast] = useState('')
	const [showCancel, setShowCancel] = useState(false)

	useEffect(() => {
		getWarehouseOrders().then((loadedOrders) => {
			setOrders(loadedOrders)
			setSelectedId(loadedOrders[0]?.id ?? '')
		})
	}, [])

	useEffect(() => {
		if (!toast) return undefined
		const timeout = window.setTimeout(() => setToast(''), 3200)
		return () => window.clearTimeout(timeout)
	}, [toast])

	const selectedOrder = orders.find((order) => order.id === selectedId)
	const normalizedSearch = search.trim().toLowerCase()
	const filteredOrders = orders.filter((order) => {
		const searchable = [order.orderNumber, order.customer.name, order.customer.city,
			...order.items.flatMap((item) => [item.name, item.sku, item.vendorName])].join(' ').toLowerCase()
		return (activeStatus === 'ALL' || order.status === activeStatus)
			&& (!normalizedSearch || searchable.includes(normalizedSearch))
	})
	const pageCount = Math.max(1, Math.ceil(filteredOrders.length / pageSize))
	const visibleOrders = filteredOrders.slice(page * pageSize, (page + 1) * pageSize)

	useEffect(() => {
		if (!visibleOrders.some((order) => order.id === selectedId)) {
			setSelectedId(visibleOrders[0]?.id ?? '')
		}
	}, [activeStatus, orders, page, search, selectedId])

	function updateOrder(orderId, changes) {
		setOrders((currentOrders) => {
			const updatedOrders = currentOrders.map((order) => order.id === orderId ? { ...order, ...changes } : order)
			saveWarehouseOrders(updatedOrders)
			return updatedOrders
		})
	}

	function advanceOrder() {
		if (!selectedOrder) return
		const status = nextStatus[selectedOrder.status]
		if (!status) return
		updateOrder(selectedOrder.id, { status })
		setToast(`${selectedOrder.orderNumber} moved to ${statusLabels[status].toLowerCase()}.`)
	}

	function confirmOrder() {
		if (!selectedOrder?.deliveryDate) return setToast('Choose a delivery date before confirming this order.')
		updateOrder(selectedOrder.id, { status: 'CONFIRMED' })
		setToast(`Order confirmed. ${selectedOrder.customer.name} can see the delivery date.`)
	}

	function cancelOrder() {
		if (!selectedOrder) return
		updateOrder(selectedOrder.id, { status: 'CANCELLED' })
		setShowCancel(false)
		setToast(`${selectedOrder.orderNumber} has been cancelled.`)
	}

	const statusAction = selectedOrder && nextStatus[selectedOrder.status]
	const itemCount = selectedOrder?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

	if (activeView === 'fulfillment') {
		return (
			<div className="app-shell">
				<div className="workspace">
					<FulfillmentPage orders={orders} onUpdateOrder={updateOrder} onOpenOrderDesk={() => setActiveView('orders')} />
				</div>
			</div>
		)
	}

	return (
		<div className="app-shell">
			<div className="workspace">
				<main className="main-content">
					<div className="page-heading">
						<div><div className="eyebrow"><span className="live-indicator" />FULFILLMENT / CUSTOMER ORDERS</div><h1>Order desk</h1><p>Review new orders, set delivery dates, and keep each customer in the loop.</p></div>
						<div className="demo-indicator"><span />Demo workspace</div>
						<button className="primary-action" onClick={() => setActiveView('fulfillment')}><PackageOpen size={15} />Picking &amp; packing</button>
					</div>

					<section className="queue-toolbar" aria-label="Search and filter orders">
						<div className="queue-tools">
							<label className="order-search"><Search size={15} aria-hidden="true" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(0) }} placeholder="Search order, customer or SKU" aria-label="Search orders, customers, and products" /></label>
							<span className="result-count">{filteredOrders.length} orders</span>
						</div>
						<div className="status-filters">
							{statuses.map((status) => {
								const count = status.id === 'ALL' ? orders.length : orders.filter((order) => order.status === status.id).length
								return <button className={`filter-chip${activeStatus === status.id ? ' filter-chip--active' : ''}`} key={status.id} onClick={() => { setActiveStatus(status.id); setPage(0) }} aria-pressed={activeStatus === status.id}>{status.label}<span>{count}</span></button>
							})}
						</div>
					</section>

					<section className="order-workspace" aria-label="Orders and selected order details">
						<div className="order-queue">
							<div className="queue-header"><div><h2>Order queue</h2><span>Newest first</span></div><button className="subtle-icon-button" aria-label="More queue options"><MoreHorizontal size={19} /></button></div>
							<div className="order-list">
								{visibleOrders.map((order) => <button className={`order-card${selectedId === order.id ? ' order-card--selected' : ''}`} key={order.id} onClick={() => setSelectedId(order.id)} aria-pressed={selectedId === order.id}>
									<span className="order-card__topline"><span className="order-reference">{order.orderNumber}</span><StatusBadge status={order.status} /></span>
									<span className="order-customer-line"><span>{order.customer.name}</span><i />{order.customer.city}</span>
									  <span className="order-item-preview">{order.items.slice(0, 3).map((item) => <ProductThumb key={item.sku} item={item} compact />)}<span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'} · {formatUnits(order.items.reduce((sum, item) => sum + item.quantity, 0))}</span></span>
									<span className={`delivery-preview${order.deliveryDate ? '' : ' delivery-preview--unset'}`}><CalendarDays size={13} />Delivery {order.deliveryDate ? formatDate(order.deliveryDate) : 'date not set'}</span>
								</button>)}
								{visibleOrders.length === 0 && <div className="empty-queue"><Search size={24} /><strong>No matching orders</strong><span>Try another status or search term.</span></div>}
							</div>
							<div className="queue-pagination"><span>{filteredOrders.length ? `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, filteredOrders.length)} of ${filteredOrders.length}` : '0 orders'}</span><div><button className="pagination-button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0} aria-label="Previous page"><ChevronLeft size={16} /></button><span className="pagination-current">{page + 1}</span><button className="pagination-button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page >= pageCount - 1} aria-label="Next page"><ChevronRight size={16} /></button></div></div>
						</div>

						{selectedOrder ? <article className="order-detail">
							<div className="detail-heading"><div><div className="detail-heading__eyebrow">ORDER DETAILS</div><h2>{selectedOrder.orderNumber}</h2><p>{selectedOrder.customer.name}<span />{selectedOrder.customer.city}</p></div><StatusBadge status={selectedOrder.status} /></div>
							<section className="delivery-address"><div className="section-overline"><MapPin size={14} />DELIVER TO</div><strong>{selectedOrder.customer.name}</strong><p>{selectedOrder.customer.address}</p><div className="address-contact"><Phone size={12} />{selectedOrder.customer.phone}</div></section>
							<div className="order-facts"><div><span>Placed</span><strong>{selectedOrder.placedAt}</strong></div><div><span>Items</span><strong>{itemCount} {itemCount === 1 ? 'unit' : 'units'}</strong></div><div><span>Warehouse</span><strong>{selectedOrder.warehouse}</strong></div><div><span>Delivery date</span><strong>{formatDate(selectedOrder.deliveryDate)}</strong></div></div>
							<div className="items-section"><div className="items-table-head"><span>Item</span><span>Bin</span><span>Qty</span><span>Stock</span></div>
								{selectedOrder.items.map((item) => <div className="item-row" key={item.sku}><ProductThumb item={item} /><div className="item-description"><strong>{item.name}</strong><span>{item.sku} · {item.variant}</span><small>Vendor · {item.vendorName}</small></div><span className="item-bin">{item.bin}</span><strong className="item-quantity">{item.quantity}</strong><span className={`item-stock${item.stock < item.quantity ? ' item-stock--low' : ''}`}>{item.stock} in stock</span></div>)}
							</div>
							<div className="fulfillment-progress" aria-label={`Order status: ${statusLabels[selectedOrder.status]}`}>
								{progressStatuses.map((status, index) => {
									const currentIndex = progressStatuses.findIndex((item) => item.id === selectedOrder.status)
									const complete = selectedOrder.status !== 'CANCELLED' && index < currentIndex
									const current = status.id === selectedOrder.status
									return <div className={`progress-step${complete ? ' progress-step--complete' : ''}${current ? ' progress-step--current' : ''}`} key={status.id}><span className="progress-marker">{complete ? <Check size={13} /> : index + 1}</span><span>{status.label}</span></div>
								})}
							</div>
							<div className="payment-note"><CreditCard size={15} /><span>Payment is <strong>{selectedOrder.paymentStatus.toLowerCase()}</strong>. Set the delivery date before confirming; the customer will see it immediately.</span></div>
							<div className="delivery-control"><label htmlFor="delivery-date">Delivery date shown to customer</label><div className="date-input-wrap"><input id="delivery-date" type="date" value={selectedOrder.deliveryDate ?? ''} disabled={['DELIVERED', 'CANCELLED'].includes(selectedOrder.status)} onChange={(event) => updateOrder(selectedOrder.id, { deliveryDate: event.target.value })} /><CalendarDays size={16} aria-hidden="true" /></div></div>
							<div className="detail-actions">
								{selectedOrder.status === 'PENDING' ? <button className="primary-action" onClick={confirmOrder} disabled={!selectedOrder.deliveryDate}><Send size={15} />Confirm & notify customer</button>
									: statusAction ? <button className="primary-action" onClick={advanceOrder}><CheckCircle2 size={16} />Mark as {statusLabels[statusAction].toLowerCase()}</button>
										: <div className="completion-note"><CheckCircle2 size={17} />{selectedOrder.status === 'DELIVERED' ? 'Order delivered' : 'Order cancelled'}</div>}
								{!['DELIVERED', 'CANCELLED'].includes(selectedOrder.status) && <button className="cancel-action" onClick={() => setShowCancel(true)}>Cancel order</button>}
							</div>
						</article> : <div className="detail-empty"><PackageOpen size={34} /><h2>Select an order</h2><p>Choose an order from the queue to review its customer and fulfillment details.</p></div>}
					</section>

					<footer className="page-footer"><span><Clock3 size={13} />Last synced just now</span><span>Warehouse demo data · Actions stay in this browser</span></footer>
				</main>
			</div>

			{toast && <div className="toast" role="status"><CheckCircle2 size={17} />{toast}<button onClick={() => setToast('')} aria-label="Dismiss notification"><X size={15} /></button></div>}
			{showCancel && selectedOrder && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCancel(false) }}><section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="cancel-title"><span className="dialog-icon"><AlertTriangle size={20} /></span><button className="dialog-close" onClick={() => setShowCancel(false)} aria-label="Close dialog"><X size={18} /></button><h2 id="cancel-title">Cancel this order?</h2><p>{selectedOrder.orderNumber} for {selectedOrder.customer.name} will be marked cancelled. This demo will not send a real customer notification.</p><div className="dialog-actions"><button className="dialog-keep" onClick={() => setShowCancel(false)}>Keep order</button><button className="dialog-cancel" onClick={cancelOrder}>Cancel order</button></div></section></div>}
		</div>
	)
}

export default App
