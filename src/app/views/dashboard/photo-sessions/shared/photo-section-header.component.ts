import { Component, Input } from '@angular/core';

export type PhotoSection = 'sessions' | 'photographer' | 'model' | 'locations';

/** Section identity; session navigation belongs inside its own workspace. */
@Component({
  selector: 'app-photo-section-header',
  template: `
    <header class="workspace-heading">
      <span class="section-symbol"><i [class]="current.icon" aria-hidden="true"></i></span>
      <div class="heading-copy"><ng-content select="div" /></div>
      <ng-content />
    </header>`,
  styleUrl: './photo-section-header.component.scss',
})
export class PhotoSectionHeaderComponent {
  @Input() section: PhotoSection = 'sessions';
  readonly sections = [
    { key: 'sessions', label: 'Sesiones', icon: 'fa-solid fa-camera-retro', path: '' },
    { key: 'photographer', label: 'Fotógrafos', icon: 'fa-solid fa-camera', path: 'photographers' },
    { key: 'model', label: 'Modelos', icon: 'fa-solid fa-user', path: 'models' },
    { key: 'locations', label: 'Locaciones', icon: 'fa-solid fa-location-dot', path: 'locations' },
  ];
  get current() { return this.sections.find(item => item.key === this.section) || this.sections[0]; }
}
