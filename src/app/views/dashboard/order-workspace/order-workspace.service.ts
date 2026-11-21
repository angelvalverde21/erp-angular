import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ImportedOrdersService } from '../initial-import/orders/imported-orders.service';
import { toWorkspaceDetail, toWorkspacePage } from './order-workspace.mapper';

/** Read-only adapter. Replace this source when the new workflow moves to orders. */
@Injectable({ providedIn: 'root' })
export class OrderWorkspaceService {
  private readonly source = inject(ImportedOrdersService);

  list(query: Record<string, string>) {
    return this.source.list(query).pipe(map(response => toWorkspacePage(response.data)));
  }

  detail(id: number) {
    return this.source.detail(id).pipe(map(response => toWorkspaceDetail(response.data)));
  }
}
