export const localIsoDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function formatClock(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatMovementTime(iso) {
  const date = new Date(iso);
  if (localIsoDate(date) === localIsoDate()) return formatClock(iso);
  const day = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${day}, ${formatClock(iso)}`;
}
