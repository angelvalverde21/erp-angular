import { followingFortnight, lastClosedFortnight, previousFortnight } from './attendance-period';

describe('Last closed attendance fortnight in Lima', () => {
  it('moves backward through month, year and leap February boundaries', () => {
    expect(previousFortnight('2026-11-16', '2026-01-01')).toEqual({ start_date: '2026-11-01', end_date: '2026-11-15' });
    expect(previousFortnight('2026-01-01', '2025-01-01')).toEqual({ start_date: '2025-12-16', end_date: '2025-12-31' });
    expect(previousFortnight('2024-03-01', '2024-01-01')).toEqual({ start_date: '2024-02-16', end_date: '2024-02-29' });
  });
  it('stops at the first available fortnight and handles missing or invalid boundaries', () => {
    expect(previousFortnight('2026-11-01', '2026-10-20')).toEqual({ start_date: '2026-10-16', end_date: '2026-10-31' });
    expect(previousFortnight('2026-10-16', '2026-10-20')).toBeNull();
    expect(previousFortnight('2026-11-01', null)).toBeNull();
    expect(previousFortnight('2026-02-31', '2026-01-01')).toBeNull();
    expect(previousFortnight('2026-11-01', '2026-02-31')).toBeNull();
  });
  it('uses the previous month second half during the first half of the current month', () => {
    expect(lastClosedFortnight(new Date('2026-11-14T18:00:00Z'))).toEqual({ start_date: '2026-10-16', end_date: '2026-10-31' });
  });
  it('uses the current month first half from the sixteenth onward', () => {
    expect(lastClosedFortnight(new Date('2026-11-16T18:00:00Z'))).toEqual({ start_date: '2026-11-01', end_date: '2026-11-15' });
  });
  it('handles year changes and leap-year February', () => {
    expect(lastClosedFortnight(new Date('2026-01-01T18:00:00Z'))).toEqual({ start_date: '2025-12-16', end_date: '2025-12-31' });
    expect(lastClosedFortnight(new Date('2024-03-01T18:00:00Z'))).toEqual({ start_date: '2024-02-16', end_date: '2024-02-29' });
  });
  it('uses Lima calendar dates at the UTC day boundary', () => {
    expect(lastClosedFortnight(new Date('2026-11-16T02:00:00Z'))).toEqual({ start_date: '2026-10-16', end_date: '2026-10-31' });
  });
  it('advances into the current fortnight only through today', () => {
    expect(followingFortnight('2026-10-31', new Date('2026-11-14T18:00:00Z'))).toEqual({ start_date: '2026-11-01', end_date: '2026-11-14' });
    expect(followingFortnight('2026-11-15', new Date('2026-12-05T18:00:00Z'))).toEqual({ start_date: '2026-11-16', end_date: '2026-11-30' });
  });
  it('advances across years and leap February', () => {
    expect(followingFortnight('2025-12-31', new Date('2026-01-20T18:00:00Z'))).toEqual({ start_date: '2026-01-01', end_date: '2026-01-15' });
    expect(followingFortnight('2024-02-15', new Date('2024-03-01T18:00:00Z'))).toEqual({ start_date: '2024-02-16', end_date: '2024-02-29' });
  });
  it('does not advance into the future or from invalid dates', () => {
    expect(followingFortnight('2026-11-14', new Date('2026-11-14T18:00:00Z'))).toBeNull();
    expect(followingFortnight('2026-11-15', new Date('2026-11-16T02:00:00Z'))).toBeNull();
    expect(followingFortnight('2026-02-31')).toBeNull();
    expect(followingFortnight('')).toBeNull();
  });
});
