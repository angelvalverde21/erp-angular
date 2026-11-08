import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsis, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-button-menu',
  imports: [
    NgbDropdownModule,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './button-menu.component.html',
  styleUrl: './button-menu.component.scss'
})
export class ButtonMenuComponent {
  private static nextId = 0;
  readonly toggleId = `action-menu-${ButtonMenuComponent.nextId++}`;
  readonly faEllipsis = faEllipsis;
  readonly faTrash = faTrash;

  @Input() menus: any[] = [];
  @Input() context = '';
}
