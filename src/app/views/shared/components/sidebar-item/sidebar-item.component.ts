import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-sidebar-item',
  imports: [],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent {

  @Input() item: any;

  isFaIcon(icon: any): icon is IconDefinition {
    return typeof icon === 'object';
  }

}
