export default function ToastStack({ toasts }) {
  return (
    <div
      className="fixed bottom-5 right-5 z-[90] flex max-w-[min(380px,calc(100vw-40px))] flex-col gap-2.5"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`wh-reveal rounded-2xl border border-[#E8DFC8] border-l-4 bg-white px-4 py-3 text-[13px] font-semibold leading-[1.45] text-[#1A1A1A] shadow-[0_14px_34px_rgba(85,62,32,.18)] ${
            t.kind === 'warn' ? 'border-l-[#B5423B]' : 'border-l-[#337454]'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
