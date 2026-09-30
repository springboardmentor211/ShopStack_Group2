import { Boxes, AlertTriangle, Truck, ClipboardCheck, Package, ArrowDownToLine } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import { useWarehouseJump } from '../hooks/useWarehouseJump';
import { ORDER_STAGES } from '../store/selectors/warehouseSelectors';
import Thumb from '../components/layout/Thumb';
import { formatClock } from '../utils/format';

const STAGE_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  picked: 'Picked',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};

const GREEN_STAGES = ['shipped', 'out_for_delivery', 'delivered'];

const STOCK_PILL = {
  'Out of Stock': 'bg-[#FBE9E7] text-[#B5423B]',
  'Low Stock': 'bg-[#F6EBDD] text-[#8F6739]',
};

const pad = (n) => String(n).padStart(2, '0');

function KpiCard({ icon: Icon, note, noteClass, label, value }) {
  return (
    <article className="wh-card rounded-2xl bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-[#F6EBDD] p-3 text-[#8F6739]">
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-xs font-semibold ${noteClass}`}>{note}</span>
      </div>
      <p className="mt-8 text-sm text-[#746D62]">{label}</p>
      <p className="wh-editorial mt-2 text-[26px] font-bold text-[#1A1A1A]">{value}</p>
    </article>
  );
}

function AttentionRow({ icon: Icon, count, text, hint, onOpen }) {
  return (
    <div className={`flex items-center justify-between gap-3 py-3.5 ${count ? '' : 'opacity-60'}`}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-lg bg-[#F6EBDD] p-2 text-[#8F6739]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#1A1A1A]">
            {count} {text}
          </p>
          <p className="text-xs text-[#746D62]">{hint}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="flex-shrink-0 rounded-lg bg-[#F6EBDD] px-3 py-2 text-xs font-bold text-[#8F6739] hover:bg-[#efdfc8]"
      >
        Open
      </button>
    </div>
  );
}

function StockRow({ item, status, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#E8DFC8] bg-white p-3 text-left hover:bg-[#fdfaf3]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Thumb category={item.category} size="sm" sku={item.sku} imageUrl={item.imageUrl} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#1A1A1A]">{item.name}</p>
          <p className="text-xs text-[#746D62]">
            {item.sku} · {item.bins.length > 1 ? 'bins' : 'bin'} {item.bins.join(', ')}
          </p>
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center gap-3">
        <span className="text-xs font-semibold text-[#746D62]">{item.qty} left</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${STOCK_PILL[status]}`}>{status}</span>
      </div>
    </button>
  );
}

export default function DashboardPage() {
  const d = useDashboard();
  const jump = useWarehouseJump();
  const dash = (value) => (d.loading ? '—' : value);

  return (
    <div className="px-5 py-7 lg:px-8">
      <div className="wh-reveal flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8F6739]">Overview</p>
          <h1 className="wh-editorial mt-3 max-w-xl text-[26px] font-bold leading-tight text-[#1A1A1A]">
            Everything you need, all in one place.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#746D62]">
            Every number below updates as you confirm orders, receive vendor stock and ship parcels.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dfcaab] bg-[#FBF4E7] px-4 py-2 text-xs font-bold text-[#8F6739]">
          <span className="h-2 w-2 rounded-full bg-[#8F6739]" />
          {d.lastSyncedAt ? `Updated ${formatClock(d.lastSyncedAt)}` : 'Loading…'}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Boxes}
          note={d.receivedToday ? `+${d.receivedToday.toLocaleString('en-IN')} received today` : 'Across all bins'}
          noteClass="text-[#337454]"
          label="Total Inventory"
          value={dash(d.totalInventory.toLocaleString('en-IN'))}
        />
        <KpiCard
          icon={AlertTriangle}
          note={d.alertCount ? 'Needs review' : 'All clear'}
          noteClass={d.alertCount ? 'text-[#8F6739]' : 'text-[#337454]'}
          label="Low Stock Alerts"
          value={dash(pad(d.alertCount))}
        />
        <KpiCard
          icon={Truck}
          note={`${d.dueToday} due today`}
          noteClass="text-[#337454]"
          label="Pending Shipments"
          value={dash(pad(d.pendingShipments))}
        />
        <KpiCard
          icon={ClipboardCheck}
          note={d.ordersToPick ? 'Action needed' : 'On schedule'}
          noteClass="text-[#8F6739]"
          label="Orders to Pick"
          value={dash(pad(d.ordersToPick))}
        />
      </div>

      <div className="wh-card mt-7 rounded-2xl bg-white p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8F6739]">Your queue</p>
        <h2 className="wh-editorial mt-3 text-[21px] font-bold text-[#1A1A1A]">Needs your attention</h2>
        <div className="mt-4 divide-y divide-[#E8DFC8]">
          <AttentionRow
            icon={Package}
            count={d.queue.ordersToConfirm}
            text="orders waiting to be confirmed"
            hint="Set the delivery date and confirm"
            onOpen={() => jump.toOrders('pending')}
          />
          <AttentionRow
            icon={ArrowDownToLine}
            count={d.queue.shipmentsToAllocate}
            text="vendor shipments waiting to be allocated"
            hint="Choose a bin and add the stock to inventory"
            onOpen={() => jump.toReceiving()}
          />
          <AttentionRow
            icon={ClipboardCheck}
            count={d.queue.inPickOrPack}
            text="orders being picked or packed"
            hint="Tick items as they are collected"
            onOpen={() => jump.toPicking('pick')}
          />
          <AttentionRow
            icon={Truck}
            count={d.queue.awaitingCarrier}
            text="packed orders waiting for a carrier"
            hint="Create shipments and dispatch"
            onOpen={() => jump.toPicking('outbound')}
          />
        </div>
      </div>

      <div className="wh-card mt-7 rounded-2xl bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8F6739]">Inventory health</p>
            <h2 className="wh-editorial mt-3 text-[21px] font-bold text-[#1A1A1A]">Low stock &amp; out of stock alerts</h2>
            <p className="mt-2 text-sm text-[#746D62]">
              Products at or below their reorder threshold, and anything fully out of stock.
            </p>
          </div>
          {d.alertCount > 0 && (
            <button
              type="button"
              onClick={() => jump.toInventory()}
              className="flex-shrink-0 rounded-lg bg-[#F6EBDD] px-3 py-2 text-xs font-bold text-[#8F6739] hover:bg-[#efdfc8]"
            >
              View all
            </button>
          )}
        </div>

        {d.alertCount > 0 ? (
          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#B5423B]">
                Out of stock · {d.outOfStock.length}
              </p>
              <div className="mt-3 space-y-2">
                {d.outOfStock.length ? (
                  d.outOfStock.map((item) => (
                    <StockRow key={item.sku} item={item} status="Out of Stock" onOpen={() => jump.toInventory('Out of Stock')} />
                  ))
                ) : (
                  <p className="py-3 text-sm text-[#746D62]">Nothing is fully out of stock.</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8F6739]">Low stock · {d.lowStock.length}</p>
              <div className="mt-3 space-y-2">
                {d.lowStock.length ? (
                  d.lowStock.map((item) => (
                    <StockRow key={item.sku} item={item} status="Low Stock" onOpen={() => jump.toInventory('Low Stock')} />
                  ))
                ) : (
                  <p className="py-3 text-sm text-[#746D62]">Nothing is below its threshold.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          !d.loading && (
            <p className="mt-5 rounded-xl bg-[#EAF4EC] px-4 py-3 text-sm font-semibold text-[#337454]">
              All products are stocked above their reorder threshold.
            </p>
          )
        )}
      </div>

      <div className="wh-card mt-7 rounded-2xl bg-white p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8F6739]">Order management</p>
        <h2 className="wh-editorial mt-3 text-[21px] font-bold text-[#1A1A1A]">Order Fulfillment Pipeline</h2>
        <p className="mt-2 text-sm text-[#746D62]">
          Live count of orders at each stage, from placement to delivery. Select a stage to open those orders.
        </p>
        <div className="mt-7 flex flex-wrap gap-6 overflow-x-auto pb-2">
          {ORDER_STAGES.map((stage) => (
            <button
              key={stage}
              type="button"
              onClick={() => jump.toOrders(stage)}
              className="group relative min-w-[88px] text-center after:absolute after:-right-[18px] after:top-[22px] after:h-[2px] after:w-[18px] after:bg-[#E8DFC8] last:after:hidden max-[900px]:after:hidden"
            >
              <div
                className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-transform group-hover:-translate-y-0.5 ${
                  GREEN_STAGES.includes(stage) ? 'bg-[#EAF4EC] text-[#337454]' : 'bg-[#F6EBDD] text-[#8F6739]'
                }`}
              >
                {dash(d.pipeline[stage] || 0)}
              </div>
              <p className="mt-2 text-xs font-semibold text-[#746D62]">{STAGE_LABEL[stage]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
