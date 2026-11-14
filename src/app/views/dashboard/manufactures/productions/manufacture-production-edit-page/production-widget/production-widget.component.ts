import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBagShopping, faBoxesStacked, faCalendarCheck, faTruckRampBox } from '@fortawesome/free-solid-svg-icons';
import { PenPipe } from '@shared/pipes/pen.pipe';
import { SummaryPurchase } from '@interfaces/summary.interface';

@Component({
  selector: 'app-production-widget',
  imports: [RouterModule, FontAwesomeModule, PenPipe],
  templateUrl: './production-widget.component.html',
  styleUrl: './production-widget.component.scss',
})
export class ProductionWidgetComponent {
  @Input() summary: SummaryPurchase | null = null;
  readonly icons = { flow: faBagShopping, products: faBoxesStacked, reception: faTruckRampBox, tracking: faCalendarCheck };
  get unitCost(): number {
    return Number(this.summary?.sum_variants) > 0 ? Number(this.summary?.sum_purchases ?? 0) / Number(this.summary?.sum_variants) : 0;
  }
}
