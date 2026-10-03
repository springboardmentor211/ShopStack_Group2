import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useReceiving } from '../hooks/useReceiving';
import { useWarehouseJump } from '../hooks/useWarehouseJump';
import { useSelector } from 'react-redux';
import { selectSkuStatusMap } from '../store/selectors/warehouseSelectors';
import Thumb from '../components/layout/Thumb';
import Pagination from '../components/common/Pagination';
import LoadNotice from '../components/common/LoadNotice';

const PAGE_SIZE = 6;

const SELECT_CLASS =
  'w-full rounded-xl border border-[#E8DFC8] bg-white px-3 py-2.5 text-sm text-[#1A1A1A] focus:border-[#8F6739] focus:outline-none focus:ring-2 focus:ring-[#8F6739]/30';

const STOCK_PILL = {
  'In Stock': 'bg-[#EAF4EC] text-[#337454]',
  'Low Stock': 'bg-[#F6EBDD] text-[#8F6739]',
  'Out of Stock': 'bg-[#FBE9E7] text-[#B5423B]',
};

export default function InventoryPage() {
  const { items, status, error, filters, categories, zones, updateFilter, reload } = useInventory();
  const { items: inboundItems } = useReceiving();
  const jump = useWarehouseJump();
  const [page, setPage] = useState(1);
  const statusBySku = useSelector(selectSkuStatusMap);

  const filterKey = `${filters.search}|${filters.category}|${filters.stock}|${filters.zone}`;

  useEffect(() => {
    setPage(1);
  }, [filterKey]);

  const openInboundBySku = useMemo(() => {
    const map = {};
    inboundItems.forEach((a) => {
      if (a.status === 'pending' && !map[a.sku]) map[a.sku] = a;
    });
    return map;
  }, [inboundItems]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return items.filter((item) => {
      const haystack = `${item.sku} ${item.name} ${item.variant || ''} ${item.vendor} ${item.category} ${item.bin}`.toLowerCase();
      return (
        haystack.includes(q) &&
        (filters.category === 'all' || item.category === filters.category) &&
        (filters.stock === 'all' || statusBySku[item.sku] === filters.stock) &&
        (filters.zone === 'all' || item.zone === filters.zone)
      );
    });
  }, [items, filters, statusBySku]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="px-5 py-7 lg:px-8">
      <h1 className="wh-editorial text-2xl font-bold text-[#1A1A1A]">Stock at a glance</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#746D62]">
        Once received stock is put away and added, it appears here as available inventory. Picked orders take stock out
        again.
      </p>

      <div className="wh-card mt-6 rounded-2xl bg-white p-5 sm:p-7">
        <form className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F6739]" />
            <input
              type="search"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search inventory"
              className={`${SELECT_CLASS} pl-9`}
            />
          </div>
          <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className={SELECT_CLASS}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={filters.stock} onChange={(e) => updateFilter('stock', e.target.value)} className={SELECT_CLASS}>
            <option value="all">All stock levels</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <select value={filters.zone} onChange={(e) => updateFilter('zone', e.target.value)} className={SELECT_CLASS}>
            <option value="all">All warehouse zones</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                Zone {z}
              </option>
            ))}
          </select>
        </form>

        <div className="mt-6">
          <LoadNotice status={status} error={error} hasData={items.length > 0} onRetry={reload} />
        </div>

        <div className="mt-2 max-h-[520px] overflow-auto rounded-xl border border-[#E8DFC8]">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-y border-[#E8DFC8] bg-[#FCF9F2] text-xs uppercase tracking-[.12em] text-[#746D62]">
                <th className="px-4 py-3 font-bold">SKU</th>
                <th className="px-4 py-3 font-bold">Product Name</th>
                <th className="px-4 py-3 font-bold">Vendor</th>
                <th className="px-4 py-3 font-bold">Category</th>
                <th className="px-4 py-3 font-bold">Quantity</th>
                <th className="px-4 py-3 font-bold">Location</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8] bg-white">
              {visible.map((item) => {
                const st = statusBySku[item.sku];
                const openAsn = st !== 'In Stock' ? openInboundBySku[item.sku] : null;
                return (
                  <tr key={`${item.sku}|${item.bin}`} className="transition-colors hover:bg-[#fbf7ee]">
                    <td className="px-4 py-4 font-semibold text-[#1A1A1A]">{item.sku}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Thumb size="sm" sku={item.sku} imageUrl={item.imageUrl} />
                        <div>
                          <span className="block font-semibold text-[#1A1A1A]">{item.name}</span>
                          {item.variant && <span className="block text-xs text-[#746D62]">{item.variant}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#746D62]">{item.vendor}</td>
                    <td className="px-4 py-4 text-[#746D62]">{item.category}</td>
                    <td className="px-4 py-4 font-semibold text-[#1A1A1A]">{item.qty.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4 text-[#746D62]">{item.bin}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${STOCK_PILL[st]}`}>{st}</span>
                    </td>
                    <td className="px-4 py-4">
                      {openAsn ? (
                        <button
                          type="button"
                          onClick={() => jump.toReceiving(openAsn.id)}
                          className="rounded-lg bg-[#EAF4EC] px-3 py-2 text-xs font-bold text-[#337454] hover:bg-[#dcede0]"
                        >
                          Incoming · {openAsn.id}
                        </button>
                      ) : st === 'In Stock' ? (
                        <span className="text-xs font-semibold text-[#746D62]">Monitoring</span>
                      ) : (
                        <span className="text-xs font-semibold text-[#B5423B]">Below threshold</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {status === 'succeeded' && items.length === 0 && (
          <p className="py-8 text-center text-sm text-[#746D62]">
            No stock in this warehouse yet. Received vendor shipments will appear here.
          </p>
        )}
        {status === 'succeeded' && items.length > 0 && filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[#746D62]">No inventory items match your current filters.</p>
        )}

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
