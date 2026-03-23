import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-add',
  imports: [
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './button-add.component.html',
  styleUrl: './button-add.component.scss'
})
export class ButtonAddComponent {

  faPlus = faPlus;

  @Input() path: any; 
  @Input() color: string = 'success'; 
  
  // @Output() action = new EventEmitter<void>();

  constructor() {
    // Puedes inicializar cualquier lógica aquí si es necesario
  } 

  // ngOnInit(): void {
  //   // Aquí puedes realizar cualquier inicialización adicional si es necesario
  // }

  // clickButton() {
  //   this.action.emit();
  //   // this.disabled = true; // Disable the button after click
  // }

}
