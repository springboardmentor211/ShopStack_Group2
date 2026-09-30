export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 pt-1" role="navigation" aria-label="pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg bg-[#F6EBDD] px-3 py-1.5 text-xs font-bold text-[#8F6739] disabled:cursor-not-allowed disabled:opacity-45"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          aria-current={n === page ? 'page' : undefined}
          onClick={() => onChange(n)}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
            n === page ? 'bg-[#8F6739] text-white' : 'bg-[#F6EBDD] text-[#8F6739]'
          }`}
        >
          {n}
        </button>
      ))}
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
