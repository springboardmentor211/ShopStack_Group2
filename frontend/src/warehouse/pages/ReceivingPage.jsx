import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useReceiving } from '../hooks/useReceiving';
import { useToasts } from '../hooks/useToasts';
import Thumb from '../components/layout/Thumb';
import ToastStack from '../components/common/ToastStack';
import LoadNotice from '../components/common/LoadNotice';
import Pagination from '../components/common/Pagination';

const PAGE_SIZE = 5;

const STATUS_LABEL = { pending: 'Pending', received: 'In inventory' };

const STATUS_PILL = {
  pending: 'bg-[#F1E7D7] text-[#746D62]',
  received: 'bg-[#337454] text-white',
};

const STATUS_STEPS = ['Pending', 'In inventory'];

const FIELD_CLASS =
  'w-full rounded-xl border border-[#E8DFC8] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8F6739] focus:outline-none focus:ring-2 focus:ring-[#8F6739]/30';

function Stepper({ current }) {
  return (
    <ol className="flex overflow-x-auto pb-1">
      {STATUS_STEPS.map((label, i) => {
        const done = i <= current;
        const now = i === current + 1;
        const dot = done
          ? 'bg-[#8F6739] text-white'
          : now
            ? 'bg-white text-[#8F6739] ring-2 ring-[#8F6739]'
            : 'bg-[#F1E7D7] text-[#a89a80]';
        return (
          <li key={label} className="relative min-w-[76px] flex-1 text-center">
            {i < STATUS_STEPS.length - 1 && (
              <span className={`absolute left-1/2 top-[13px] h-[2px] w-full ${done ? 'bg-[#8F6739]' : 'bg-[#E8DFC8]'}`} />
            )}
            <span
              className={`relative z-10 mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${dot}`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className={`mt-2 block text-[11px] font-semibold ${now ? 'text-[#1A1A1A]' : 'text-[#746D62]'}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[#746D62]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#1A1A1A]">{value}</p>
    </div>
  );
}

export default function ReceivingPage() {
  const {
    items,
    bins,
    status,
    error,
    selectedId,
    filters,
    inventoryItems,
    isReceiving,
    receiveError,
    select,
    updateFilter,
    receive,
    reload,
  } = useReceiving();
  const { toasts, push } = useToasts();
  const [bin, setBin] = useState('');
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return items.filter((a) => {
      const haystack = `${a.vendor} ${a.sku} ${a.id} ${a.product ? a.product.name : ''}`.toLowerCase();
      return haystack.includes(q) && (filters.status === 'all' || a.status === filters.status);
    });
  }, [items, filters]);

  const filterKey = `${filters.search}|${filters.status}`;

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleItems = filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    const index = filteredItems.findIndex((a) => a.id === selectedId);
    if (index >= 0) setPage(Math.floor(index / PAGE_SIZE) + 1);
  }, [selectedId]);

  useEffect(() => {
    if (status !== 'succeeded') return;
    if (filteredItems.length && !filteredItems.some((a) => a.id === selectedId)) {
      select(filteredItems[0].id);
    } else if (!filteredItems.length && selectedId) {
      select(null);
    }
  }, [filteredItems, selectedId, status]);

  const selected = useMemo(() => items.find((a) => a.id === selectedId) || null, [items, selectedId]);
  const product = selected ? selected.product : null;

  const stockRows = useMemo(
    () => (selected ? inventoryItems.filter((i) => i.sku === selected.sku) : []),
    [inventoryItems, selected]
  );

  const suggestedBin = useMemo(() => {
    const stocked = stockRows.filter((r) => r.qty > 0).sort((a, b) => b.qty - a.qty);
    return stocked.length ? stocked[0].bin : '';
  }, [stockRows]);

  const currentQty = stockRows.reduce((sum, r) => sum + r.qty, 0);

  useEffect(() => {
    setBin(suggestedBin);
  }, [selected?.id, suggestedBin]);

  async function handleReceive() {
    if (!selected || !bin || isReceiving) return;
    const expectedQty = currentQty + selected.qty;
    const ok = await receive(selected.id, bin);
    if (ok) push(`${product?.name || selected.sku} now has ${expectedQty.toLocaleString('en-IN')} units available.`);
    else push('Could not allocate this shipment. Please try again.', 'warn');
  }

  return (
    <div className="px-5 py-7 lg:px-8">
      <h1 className="wh-editorial text-2xl font-bold text-[#1A1A1A]">Inbound Shipments</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#746D62]">
        When a vendor's stock arrives, allocate it to a bin and add it straight to inventory.
      </p>

      <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F6739]" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search vendor, SKU or ASN ID"
            className={`${FIELD_CLASS} pl-9`}
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className={`${FIELD_CLASS} sm:w-[190px]`}
        >
          <option value="all">All shipments</option>
          <option value="pending">Pending</option>
          <option value="received">In inventory</option>
        </select>
      </form>

      <div className="mt-5">
        <LoadNotice status={status} error={error} hasData={items.length > 0} onRetry={reload} />
      </div>

      <div className="mt-2 grid gap-7 xl:grid-cols-[.9fr_1.1fr]">
        <div className="wh-card self-start rounded-2xl bg-white p-4 sm:p-5">
          <div className="space-y-3">
          {visibleItems.map((a) => {
            const p = a.product;
            const isSelected = a.id === selectedId;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => select(a.id)}
                className={`w-full rounded-xl border p-4 text-left transition-colors ${
                  isSelected ? 'border-[#c9aa7d] bg-[#FBF4E7]' : 'border-[#E8DFC8] bg-white hover:bg-[#fdfaf3]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Thumb category={p?.category} size="md" sku={a.sku} imageUrl={p?.imageUrl} />
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A]">{a.vendor}</p>
                      <p className="mt-1 text-xs text-[#746D62]">
                        {a.id} · {a.qty} × {p ? p.name : a.sku}
                      </p>
                    </div>
                  </div>
                  <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${STATUS_PILL[a.status]}`}>
                    {STATUS_LABEL[a.status]}
                  </span>
                </div>
              </button>
            );
          })}
          {filteredItems.length === 0 && status === 'succeeded' && (
            <p className="py-8 text-center text-sm text-[#746D62]">No shipments match your search.</p>
          )}
          </div>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>

        <div className="xl:sticky xl:top-24 xl:max-h-[calc(100vh-140px)] xl:self-start xl:overflow-y-auto">
          {!selected ? (
            <div className="wh-card rounded-2xl bg-white p-5 text-sm text-[#746D62] sm:p-6">
              Select a shipment to review it.
            </div>
          ) : (
            <div className="wh-card rounded-2xl bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-4">
                  <Thumb category={product?.category} size="lg" sku={selected.sku} imageUrl={product?.imageUrl} />
                  <div>
                    <p className="wh-editorial text-lg font-bold text-[#1A1A1A]">
                      {selected.id} · {selected.vendor}
                    </p>
                    <p className="mt-1 text-sm text-[#746D62]">
                      {selected.qty} × {product ? product.name : selected.sku} ({selected.sku})
                    </p>
                    {product?.variant && <p className="text-xs text-[#746D62]">{product.variant}</p>}
                  </div>
                </div>
                <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${STATUS_PILL[selected.status]}`}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Detail label="Units" value={selected.qty.toLocaleString('en-IN')} />
                <Detail label="Bin" value={selected.bin || 'Not allocated'} />
                <Detail label="Status" value={STATUS_LABEL[selected.status]} />
              </div>

              {selected.vendorDetails && (
                <div className="mt-5 border-t border-[#E8DFC8] pt-5">
                  <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a89a80]">Vendor details</p>
                  <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <Detail label="Shop / company" value={selected.vendorDetails.shop} />
                    <Detail label="GSTIN" value={selected.vendorDetails.gstin} />
                    <Detail label="Contact person" value={selected.vendorDetails.contact} />
                    <Detail label="Phone" value={selected.vendorDetails.phone} />
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Stepper current={selected.status === 'received' ? 1 : 0} />
              </div>

              <div className="mt-6 border-t border-[#E8DFC8] pt-5">
                {selected.status === 'pending' ? (
                  <>
                    <p className="text-sm text-[#746D62]">
                      Stock from {selected.vendor} has arrived. Choose a bin to allocate it and add it to inventory.
                      {suggestedBin && ` This product is already stored in ${suggestedBin}, so that bin is pre-selected. You can choose another bin.`}
                    </p>
                    <div className="mt-4 flex flex-wrap items-end gap-3">
                      <label className="block min-w-[160px] flex-1 text-xs font-semibold text-[#746D62]">
                        Bin location
                        <select
                          value={bin}
                          onChange={(e) => setBin(e.target.value)}
                          disabled={isReceiving}
                          className={`${FIELD_CLASS} mt-1 disabled:cursor-not-allowed disabled:bg-[#FCF9F2]`}
                        >
                          <option value="">Select bin</option>
                          {Object.entries(bins).map(([zone, zoneBins]) => (
                            <optgroup key={zone} label={`Zone ${zone}`}>
                              {zoneBins.map((b) => (
                                <option key={b} value={b}>
                                  {b}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        onClick={handleReceive}
                        disabled={!bin || isReceiving}
                        className="rounded-xl bg-[#337454] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#275c43] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {isReceiving ? 'Adding…' : 'Allocate & add to inventory'}
                      </button>
                    </div>
                    {receiveError && (
                      <p className="mt-3 rounded-xl bg-[#FBE9E7] px-4 py-2.5 text-sm font-semibold text-[#B5423B]">
                        {receiveError}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="rounded-xl bg-[#EAF4EC] px-4 py-3 text-sm font-semibold text-[#337454]">
                    Done. {selected.qty.toLocaleString('en-IN')} units are stored in {selected.bin} and live in inventory.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <ToastStack toasts={toasts} />
    </div>
  );
}
