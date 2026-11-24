import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseService } from '../../../../base.service';

@Component({
  selector: 'app-manufacture-collection-badge',
  imports: [RouterLink],
  template: `@if (collection) {
    <a class="manufacture-collection-badge" [routerLink]="['/', base.store, 'dashboard', 'collections', collection.id]" [queryParams]="{ view: 'processes' }" [title]="'Ver colección: ' + collection.name" [attr.aria-label]="'Ver colección: ' + collection.name"><i class="fa-solid fa-layer-group" aria-hidden="true"></i><span>Colección · {{ collection.name }}</span></a>
  }`,
  styles: `:host { display: block; }
    .manufacture-collection-badge { display: inline-flex; align-items: baseline; gap: 6px; max-width: min(320px, 100%); margin-top: 7px; padding: 4px 8px; border: 1px solid color-mix(in srgb, #7055ad 18%, var(--cui-body-bg, #fff)); border-radius: 6px; background: color-mix(in srgb, #7055ad 9%, var(--cui-body-bg, #fff)); color: var(--cui-primary-text-emphasis, #624594); font-size: 11px; font-weight: 600; line-height: 1.5; text-decoration: none; }
    .manufacture-collection-badge span { min-width: 0; white-space: normal; overflow-wrap: anywhere; }
    .manufacture-collection-badge i { flex-shrink: 0; font-size: 10px; }
    .manufacture-collection-badge:hover { border-color: #9f88c5; background: color-mix(in srgb, #7055ad 14%, var(--cui-body-bg, #fff)); }
    .manufacture-collection-badge:focus-visible { outline: 2px solid #7055ad; outline-offset: 3px; }`,
})
export class ManufactureCollectionBadgeComponent {
  readonly base = inject(BaseService);
  @Input() collection: { id: number; name: string } | null = null;
}
