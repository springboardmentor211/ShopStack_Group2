export default function LoadNotice({ status, error, hasData, onRetry, loadingText = 'Loading…' }) {
  if (status === 'failed') {
    return (
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FBE9E7] px-4 py-3 text-sm font-semibold text-[#B5423B]">
        <span>{error}</span>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#B5423B]"
        >
          Retry
        </button>
      </div>
    );
  }
  if ((status === 'idle' || status === 'loading') && !hasData) {
    return <p className="py-6 text-center text-sm text-[#746D62]">{loadingText}</p>;
  }
  return null;
}
