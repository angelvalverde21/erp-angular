import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Location } from 'src/app/interfaces/location.interface';
import { buildLocationTree, locationTrail, LocationNode } from './location-tree';

@Component({ selector: 'app-location-index', imports: [RouterLink, NgTemplateOutlet], templateUrl: './location-index.component.html', styleUrl: './location-index.component.scss' })
export class LocationIndexComponent implements OnChanges {
  @Input() locations: Location[] = [];
  @Input() selectedLocationId: number | null = null;
  @Input() deletingId: number | null = null;
  @Output() selectLocation = new EventEmitter<number>();
  @Output() deleteLocation = new EventEmitter<Location>();
  trail: Location[] = [];
  ancestorIds = new Set<number>();
  nodes: LocationNode[] = [];
  readonly collapsed = new Set<number>();

  toggle(id: number): void {
    if (this.collapsed.has(id)) this.collapsed.delete(id);
    else this.collapsed.add(id);
  }

  ngOnChanges(): void {
    this.nodes = buildLocationTree(this.locations);
    this.trail = locationTrail(this.locations, this.selectedLocationId);
    this.ancestorIds = new Set(this.trail.slice(0, -1).map(location => location.id));
    for (const id of this.ancestorIds) this.collapsed.delete(id);
  }
}
