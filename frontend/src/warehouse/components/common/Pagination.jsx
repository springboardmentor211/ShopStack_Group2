export function pageItems(page, totalPages) {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = Array.from(wanted)
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  const items = [];
  sorted.forEach((n, i) => {
    if (i > 0) {
      const gap = n - sorted[i - 1];
      if (gap === 2) items.push(n - 1);
      else if (gap > 2) items.push(`gap-${n}`);
    }
    items.push(n);
  });
  return items;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 pt-1">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg bg-[#F6EBDD] px-3 py-1.5 text-xs font-bold text-[#8F6739] disabled:cursor-not-allowed disabled:opacity-45"
      >
        Prev
      </button>
      {pageItems(page, totalPages).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-1 text-xs font-bold text-[#a89a80]">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
              item === page ? 'bg-[#8F6739] text-white' : 'bg-[#F6EBDD] text-[#8F6739]'
            }`}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg bg-[#F6EBDD] px-3 py-1.5 text-xs font-bold text-[#8F6739] disabled:cursor-not-allowed disabled:opacity-45"
      >
        Next
      </button>
    </div>
  );
}
