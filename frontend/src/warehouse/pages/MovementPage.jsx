import { useEffect, useState } from 'react';
import { useMovements } from '../hooks/useMovements';
import LoadNotice from '../components/common/LoadNotice';
import Pagination from '../components/common/Pagination';
import { formatMovementTime } from '../utils/format';

const MOVE_TYPE_PILL = {
  Putaway: 'bg-[#EAF4EC] text-[#337454]',
  Pick: 'bg-[#F6EBDD] text-[#8F6739]',
};

const PAGE_SIZE = 8;

const DEFAULT_PILL = 'bg-[#F1E7D7] text-[#746D62]';

export default function MovementPage() {
  const { items, status, error, reload } = useMovements();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [items.length]);

  return (
    <div className="px-5 py-7 lg:px-8">
      <h1 className="wh-editorial text-2xl font-bold text-[#1A1A1A]">Stock Movement Log</h1>
      <p className="mt-2 max-w-2xl text-sm text-[#746D62]">
        Every putaway and pick is logged here for full traceability. New actions appear at the top.
      </p>

      <div className="wh-card mt-6 rounded-2xl bg-white p-5 sm:p-7">
        <LoadNotice status={status} error={error} hasData={items.length > 0} onRetry={reload} />

        <div className="overflow-x-auto rounded-xl border border-[#E8DFC8]">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr className="sticky top-0 z-10 border-y border-[#E8DFC8] bg-[#FCF9F2] text-xs uppercase tracking-[.12em] text-[#746D62]">
                <th className="px-3 py-3 font-bold">Time</th>
                <th className="px-3 py-3 font-bold">SKU</th>
                <th className="px-3 py-3 font-bold">Type</th>
                <th className="px-3 py-3 font-bold">From → To</th>
                <th className="px-3 py-3 font-bold">Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8] bg-white">
              {visibleItems.map((m) => (
                <tr key={m.id}>
                  <td className="whitespace-nowrap px-3 py-3 text-[#746D62]">{formatMovementTime(m.at)}</td>
                  <td className="px-3 py-3 font-semibold text-[#1A1A1A]">{m.sku}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${MOVE_TYPE_PILL[m.type] || DEFAULT_PILL}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[#746D62]">
                    {m.from} → {m.to}
                  </td>
                  <td className="px-3 py-3 font-semibold text-[#1A1A1A]">{m.qty.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && status === 'succeeded' && (
          <p className="py-8 text-center text-sm text-[#746D62]">No stock movement recorded yet.</p>
        )}

        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
