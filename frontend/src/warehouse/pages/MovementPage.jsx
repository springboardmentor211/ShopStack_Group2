import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovements } from '../hooks/useMovements';
import LoadNotice from '../components/common/LoadNotice';
import Pagination from '../components/common/Pagination';
import { formatMovementTime } from '../utils/format';

const MOVE_TYPE_PILL = {
  Putaway: 'bg-[#EAF4EC] text-[#337454]',
  Pick: 'bg-[#F6EBDD] text-[#8F6739]',
  'Order placed': 'bg-[#E8EEF7] text-[#3A5A8C]',
  Confirmed: 'bg-[#E8EEF7] text-[#3A5A8C]',
  Pack: 'bg-[#F1E7F3] text-[#7A4A86]',
  Ship: 'bg-[#E3F1F4] text-[#2F6F7E]',
  'Out for delivery': 'bg-[#E3F1F4] text-[#2F6F7E]',
  Delivered: 'bg-[#EAF4EC] text-[#337454]',
  Cancelled: 'bg-[#FBE9E7] text-[#B5423B]',
};

const DOT_COLOR = {
  Putaway: 'bg-[#337454]',
  Pick: 'bg-[#8F6739]',
  'Order placed': 'bg-[#3A5A8C]',
  Confirmed: 'bg-[#3A5A8C]',
  Pack: 'bg-[#7A4A86]',
  Ship: 'bg-[#2F6F7E]',
  'Out for delivery': 'bg-[#2F6F7E]',
  Delivered: 'bg-[#337454]',
  Cancelled: 'bg-[#B5423B]',
};

const STAGES = ['Order placed', 'Confirmed', 'Pick', 'Pack', 'Ship', 'Out for delivery', 'Delivered'];
const CANCELLED_RANK = 99;
const PAGE_SIZE = 8;
const DEFAULT_PILL = 'bg-[#F1E7D7] text-[#746D62]';
const DEFAULT_DOT = 'bg-[#a89a80]';
const ORDER_REF = /\b(?:[A-Z0-9]+-)?ORD-[A-Z0-9]+\b/;

function stageRank(type) {
  if (type === 'Cancelled') return CANCELLED_RANK;
  const index = STAGES.indexOf(type);
  return index === -1 ? -1 : index;
}

function orderNumberOf(movement) {
  const match = `${movement.from || ''} ${movement.to || ''}`.match(ORDER_REF);
  return match ? match[0] : null;
}

function timeOf(movement) {
  return Date.parse(movement.at) || 0;
}

function buildRows(items) {
  const orders = new Map();
  const rows = [];

  items.forEach((movement) => {
    const orderNumber = orderNumberOf(movement);
    if (!orderNumber || stageRank(movement.type) === -1) {
      rows.push({ key: movement.id, orderNumber: null, events: [movement] });
      return;
    }
    if (!orders.has(orderNumber)) {
      const row = { key: orderNumber, orderNumber, events: [] };
      orders.set(orderNumber, row);
      rows.push(row);
    }
    orders.get(orderNumber).events.push(movement);
  });

  return rows
    .map((row) => {
      const events = [...row.events].sort(
        (a, b) => stageRank(a.type) - stageRank(b.type) || timeOf(a) - timeOf(b)
      );
      const topRank = Math.max(...events.map((e) => stageRank(e.type)));
      const latestEvents = row.orderNumber ? events.filter((e) => stageRank(e.type) === topRank) : events;
      const latest = [...latestEvents].sort((a, b) => timeOf(b) - timeOf(a))[0];
      const skus = Array.from(new Set(events.map((e) => e.sku)));
      const stageCount = new Set(events.map((e) => e.type)).size;
      return {
        ...row,
        events,
        latest,
        skus,
        stageCount,
        qty: latestEvents.reduce((sum, e) => sum + (Number(e.qty) || 0), 0),
        at: latest.at,
        rank: topRank,
      };
    })
    .sort((a, b) => timeOf({ at: b.at }) - timeOf({ at: a.at }) || b.rank - a.rank);
}

function formatFullTime(iso) {
  const date = new Date(iso);
  const day = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const clock = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return { day, clock };
}

function groupByStage(events) {
  const groups = [];
  events.forEach((event) => {
    const last = groups[groups.length - 1];
    if (last && last.type === event.type) last.events.push(event);
    else groups.push({ type: event.type, events: [event] });
  });
  return groups.map((group) => ({
    ...group,
    at: group.events.reduce((first, e) => (timeOf(e) < timeOf(first) ? e : first), group.events[0]).at,
  }));
}

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 4l6 6-6 6" />
    </svg>
  );
}

function ProgressTrack({ latestType }) {
  const cancelled = latestType === 'Cancelled';
  const reached = cancelled ? -1 : stageRank(latestType);
  const steps = cancelled ? [...STAGES.slice(0, 1), 'Cancelled'] : STAGES;

  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-[640px] items-start">
        {steps.map((step, index) => {
          const isCancelledStep = step === 'Cancelled';
          const done = isCancelledStep || index <= reached;
          const current = isCancelledStep || index === reached;
          const circle = isCancelledStep
            ? 'border-[#B5423B] bg-[#B5423B] text-white'
            : done
              ? 'border-[#8F6739] bg-[#8F6739] text-white'
              : 'border-[#E8DFC8] bg-white text-[#a89a80]';
          const lineDone = index < reached;
          return (
            <li key={step} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div className={`h-0.5 flex-1 ${index === 0 ? 'bg-transparent' : done ? (isCancelledStep ? 'bg-[#B5423B]' : 'bg-[#8F6739]') : 'bg-[#E8DFC8]'}`} />
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold ${circle} ${
                    current ? 'ring-4 ring-[#8F6739]/15' : ''
                  }`}
                >
                  {done ? (
                    isCancelledStep ? '×' : '✓'
                  ) : (
                    index + 1
                  )}
                </div>
                <div className={`h-0.5 flex-1 ${index === steps.length - 1 ? 'bg-transparent' : lineDone ? 'bg-[#8F6739]' : 'bg-[#E8DFC8]'}`} />
              </div>
              <span className={`mt-2 px-1 text-center text-xs font-semibold ${done ? 'text-[#1A1A1A]' : 'text-[#a89a80]'}`}>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function OrderTimeline({ row, onBack }) {
  const groups = groupByStage(row.events);
  const first = row.events[0];
  const totalQty = row.events
    .filter((e) => e.type === row.events[0].type)
    .reduce((sum, e) => sum + (Number(e.qty) || 0), 0);

  return (
    <div className="px-5 py-7 lg:px-8">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg bg-[#F6EBDD] px-3 py-1.5 text-xs font-bold text-[#8F6739] hover:bg-[#F1E7D7]"
      >
        <span className="rotate-180">
          <Chevron />
        </span>
        Back to Stock Movement
      </button>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#746D62]">Order timeline</p>
          <h1 className="wh-editorial mt-1 text-2xl font-bold text-[#1A1A1A]">{row.orderNumber}</h1>
          <p className="mt-1 text-sm text-[#746D62]">
            {row.skus.length} {row.skus.length === 1 ? 'item' : 'items'} · {totalQty.toLocaleString('en-IN')} units · started{' '}
            {formatMovementTime(first.at)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-[#746D62]">Current status</p>
          <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-bold ${MOVE_TYPE_PILL[row.latest.type] || DEFAULT_PILL}`}>
            {row.latest.type}
          </span>
        </div>
      </div>

      <div className="wh-card mt-6 rounded-2xl bg-white p-5 sm:p-7">
        <ProgressTrack latestType={row.latest.type} />
      </div>

      <div className="wh-card mt-5 rounded-2xl bg-white p-5 sm:p-7">
        <h2 className="wh-editorial text-lg font-bold text-[#1A1A1A]">Status history</h2>
        <p className="mt-1 text-sm text-[#746D62]">Every status change with the exact time it happened.</p>

        <ol className="mt-6">
          {groups.map((group, index) => {
            const { day, clock } = formatFullTime(group.at);
            const isLast = index === groups.length - 1;
            const isLatest = isLast;
            return (
              <li key={`${group.type}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && <span className="absolute left-[9px] top-5 h-full w-0.5 bg-[#E8DFC8]" />}
                <span
                  className={`relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-4 border-white shadow ${DOT_COLOR[group.type] || DEFAULT_DOT} ${
                    isLatest ? 'ring-4 ring-[#8F6739]/15' : ''
                  }`}
                />
                <div className={`flex-1 rounded-xl border p-4 ${isLatest ? 'border-[#8F6739]/40 bg-[#FCF9F2]' : 'border-[#E8DFC8] bg-white'}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${MOVE_TYPE_PILL[group.type] || DEFAULT_PILL}`}>{group.type}</span>
                      {isLatest && <span className="text-xs font-bold uppercase tracking-[.12em] text-[#8F6739]">Latest</span>}
                    </div>
                    <div className="text-right text-xs text-[#746D62]">
                      <span className="font-semibold text-[#1A1A1A]">{clock}</span> · {day}
                    </div>
                  </div>

                  <ul className="mt-3 space-y-2">
                    {group.events.map((event) => (
                      <li key={event.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <div className="min-w-0">
                          <span className="font-semibold text-[#1A1A1A]">{event.sku}</span>
                          <span className="ml-2 text-[#746D62]">
                            {event.from} → {event.to}
                          </span>
                        </div>
                        <span className="font-semibold text-[#1A1A1A]">× {Number(event.qty).toLocaleString('en-IN')}</span>
                      </li>
                    ))}
                  </ul>

                  {group.events[0].performedBy && (
                    <p className="mt-3 text-xs text-[#a89a80]">By {group.events[0].performedBy}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default function MovementPage() {
  const { items, status, error, reload } = useMovements();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedOrder = searchParams.get('order');

  const rows = useMemo(() => buildRows(items), [items]);
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [rows.length]);

  function openOrder(orderNumber) {
    setSearchParams({ order: orderNumber });
  }

  function closeOrder() {
    setSearchParams({});
  }

  if (selectedOrder) {
    const row = rows.find((r) => r.orderNumber === selectedOrder);
    if (row) return <OrderTimeline row={row} onBack={closeOrder} />;
    if (status === 'succeeded') {
      return (
        <div className="px-5 py-7 lg:px-8">
          <div className="wh-card rounded-2xl bg-white p-6 text-sm text-[#746D62]">
            No movement found for {selectedOrder}.
            <button type="button" onClick={closeOrder} className="ml-2 font-bold text-[#8F6739] underline">
              Back to Stock Movement
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="px-5 py-7 lg:px-8">
      <h1 className="wh-editorial text-2xl font-bold text-[#1A1A1A]">Stock Movement Log</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#746D62]">
        Each order shows its latest status here. Click an order to see every status change with the time it happened. Putaway entries are single actions.
      </p>

      <div className="wh-card mt-6 rounded-2xl bg-white p-5 sm:p-7">
        <LoadNotice status={status} error={error} hasData={items.length > 0} onRetry={reload} />

        <div className="overflow-x-auto rounded-xl border border-[#E8DFC8]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-y border-[#E8DFC8] bg-[#FCF9F2] text-xs uppercase tracking-[.12em] text-[#746D62]">
                <th className="px-3 py-3 font-bold">Time</th>
                <th className="px-3 py-3 font-bold">SKU</th>
                <th className="px-3 py-3 font-bold">Latest status</th>
                <th className="px-3 py-3 font-bold">From → To</th>
                <th className="px-3 py-3 font-bold">Qty</th>
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8] bg-white">
              {visibleRows.map((row) => {
                const clickable = Boolean(row.orderNumber);
                const m = row.latest;
                return (
                  <tr
                    key={row.key}
                    tabIndex={clickable ? 0 : undefined}
                    onClick={clickable ? () => openOrder(row.orderNumber) : undefined}
                    onKeyDown={
                      clickable
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openOrder(row.orderNumber);
                            }
                          }
                        : undefined
                    }
                    className={clickable ? 'group cursor-pointer transition-colors hover:bg-[#FCF9F2] focus:bg-[#FCF9F2] focus:outline-none' : ''}
                  >
                    <td className="whitespace-nowrap px-3 py-3 text-[#746D62]">{formatMovementTime(row.at)}</td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-[#1A1A1A]">
                        {row.skus[0]}
                        {row.skus.length > 1 && <span className="ml-1 text-xs font-bold text-[#8F6739]">+{row.skus.length - 1} more</span>}
                      </div>
                      {clickable && <div className="mt-0.5 text-xs text-[#a89a80]">{row.orderNumber}</div>}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${MOVE_TYPE_PILL[m.type] || DEFAULT_PILL}`}>{m.type}</span>
                      {clickable && row.stageCount > 1 && (
                        <div className="mt-1 text-xs text-[#a89a80]">{row.stageCount} status updates</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[#746D62]">
                      {m.from} → {m.to}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#1A1A1A]">{row.qty.toLocaleString('en-IN')}</td>
                    <td className="px-3 py-3 text-[#a89a80] group-hover:text-[#8F6739]">{clickable && <Chevron />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && status === 'succeeded' && (
          <p className="py-8 text-center text-sm text-[#746D62]">No stock movement recorded yet.</p>
        )}

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
