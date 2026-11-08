import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseService } from 'src/app/views/base.service';

@Component({
  selector: 'app-manufacture-section-header',
  imports: [RouterLink],
  templateUrl: './manufacture-section-header.component.html',
  styleUrl: './manufacture-section-header.component.scss',
})
export class ManufactureSectionHeaderComponent {
  @Input({ required: true }) section!: 'production' | 'order';
  @Input({ required: true }) title = '';
  @Input() description = '';
  @Input() reference = '';
  @Input() actionLabel = '';
  @Input() actionLink: string[] | null = null;
  @Input() backLink: string[] | null = null;
  @Input() backLabel = 'Volver al listado';
  @Input() showNavigation = false;

  constructor(
    private _base: BaseService,
  ) {}

  get store(): string | null {
    return this._base.store;
  }
}
