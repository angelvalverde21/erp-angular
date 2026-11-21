/** Accept the flat list and the date/direction groups returned by the kardex APIs. */
export function flattenKardexes(entries: unknown): any[] {
  if (!Array.isArray(entries)) return [];
  return entries.flatMap(entry => {
    if (!entry || typeof entry !== 'object') return [];
    if (Array.isArray(entry.groups)) return flattenKardexes(entry.groups);
    if (Array.isArray(entry.kardexes)) return flattenKardexes(entry.kardexes);
    if (Array.isArray(entry.items)) return flattenKardexes(entry.items);
    return 'quantity' in entry || 'direction' in entry ? [entry] : [];
  });
}
