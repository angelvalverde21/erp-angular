export function lastClosedFortnight(now = new Date()): { start_date: string; end_date: string } {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now).split('-').map(Number);
  const end = day > 15 ? new Date(Date.UTC(year, month - 1, 15)) : new Date(Date.UTC(year, month - 1, 0));
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), day > 15 ? 1 : 16));
  return { start_date: start.toISOString().slice(0, 10), end_date: end.toISOString().slice(0, 10) };
}

export function previousFortnight(startDate: string, earliestDate: string | null): { start_date: string; end_date: string } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !earliestDate || !/^\d{4}-\d{2}-\d{2}$/.test(earliestDate)) return null;
  const current = new Date(`${startDate}T00:00:00Z`);
  const earliest = new Date(`${earliestDate}T00:00:00Z`);
  if (!Number.isFinite(current.getTime()) || current.toISOString().slice(0, 10) !== startDate
    || !Number.isFinite(earliest.getTime()) || earliest.toISOString().slice(0, 10) !== earliestDate) return null;
  const end = current.getUTCDate() <= 15
    ? new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 0))
    : new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 15));
  const endDate = end.toISOString().slice(0, 10);
  if (endDate < earliestDate) return null;
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() === 15 ? 1 : 16));
  return { start_date: start.toISOString().slice(0, 10), end_date: endDate };
}

export function followingFortnight(endDate: string, now = new Date()): { start_date: string; end_date: string } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return null;
  const end = new Date(`${endDate}T00:00:00Z`);
  if (!Number.isFinite(end.getTime()) || end.toISOString().slice(0, 10) !== endDate) return null;
  const start = end.getUTCDate() <= 15
    ? new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 16))
    : new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 1));
  const nextEnd = start.getUTCDate() === 1
    ? new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 15))
    : new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0));
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const startDate = start.toISOString().slice(0, 10);
  const scheduledEnd = nextEnd.toISOString().slice(0, 10);
  return startDate > today ? null : { start_date: startDate, end_date: scheduledEnd < today ? scheduledEnd : today };
}
