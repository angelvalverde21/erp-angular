import { EMPTY, expand, map, Observable, reduce } from 'rxjs';
/** The supplier endpoint is paginated; customer endpoints may return a plain collection. */
export function loadContactDirectory(service: { index(page?: number): Observable<unknown> }): Observable<any[]> {
  return service.index(1).pipe(
    expand((response: any) => Number(response.current_page ?? 1) < Number(response.last_page ?? 1)
      ? service.index(Number(response.current_page) + 1) : EMPTY),
    map((response: any) => Array.isArray(response.data) ? response.data : []),
    reduce((records: any[], page: any[]) => records.concat(page), []),
  );
}
