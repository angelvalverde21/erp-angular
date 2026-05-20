import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonEditComponent } from "../button-edit/button-edit.component";


@Component({
  selector: 'app-button-menu',
  imports: [
    NgbDropdownModule,
    RouterModule,
    FontAwesomeModule,
    ButtonEditComponent
],
  templateUrl: './button-menu.component.html',
  styleUrl: './button-menu.component.scss'
})
export class ButtonMenuComponent {

  faEdit = faEdit;
  faTrash = faTrash;

  @Input() menus: any[] = []; 

}
