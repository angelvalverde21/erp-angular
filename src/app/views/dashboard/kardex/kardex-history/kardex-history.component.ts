import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManufactureKardexService } from '../../manufactures/manufacture.kardex.service';
import { KardexIndexComponent } from '../kardex-index/kardex-index.component';
import { KardexSummary } from 'src/app/interfaces/kardexSummary.interface';

@Component({
  selector: 'app-kardex-history', imports: [KardexIndexComponent], providers: [ManufactureKardexService],
  templateUrl: './kardex-history.component.html', styleUrl: './kardex-history.component.scss',
})
export class KardexHistoryComponent implements OnChanges, OnDestroy {
  @Input({ required: true }) manufactureId = 0;
  @Input() revision = 0;
  @Output() summaryChange = new EventEmitter<KardexSummary>();
  open = false;
  loading = false;
  loaded = false;
  error = '';
  records: any[] = [];
  private request?: Subscription;
  constructor(private service: ManufactureKardexService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['manufactureId'] || changes['revision']) {
      this.request?.unsubscribe(); this.loading = false; this.loaded = false; this.error = '';
      if (this.open) this.load();
    }
  }
  toggle(event: Event): void {
    this.open = (event.target as HTMLDetailsElement).open;
    if (this.open && !this.loaded && !this.loading) this.load();
  }
  load(): void {
    if (!this.open || !this.manufactureId || this.loading) return;
    this.loading = true; this.error = '';
    this.service.setManufactureId(this.manufactureId);
    this.request = this.service.index().subscribe({
      next: (response: any) => { this.records = Array.isArray(response.data) ? response.data : []; this.loaded = true; this.loading = false; },
      error: () => { this.loading = false; this.error = 'No se pudieron consultar los movimientos. Intenta nuevamente.'; },
    });
  }
  ngOnDestroy(): void { this.request?.unsubscribe(); }
}
