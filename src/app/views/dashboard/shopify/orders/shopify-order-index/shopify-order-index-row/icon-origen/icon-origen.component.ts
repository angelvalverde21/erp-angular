import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe, faStore } from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-icon-origen',
  imports: [
    FontAwesomeModule,
    NgbTooltipModule
  ],
  templateUrl: './icon-origen.component.html',
  styleUrl: './icon-origen.component.scss',
})
export class IconOrigenComponent {
  @Input() origen: string = '';

  faStore = faStore;
  faGlobe = faGlobe;
}
