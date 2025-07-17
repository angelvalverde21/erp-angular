import { Component, EventEmitter, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-add',
  imports: [FontAwesomeModule],
  templateUrl: './button-add.component.html',
  styleUrl: './button-add.component.scss'
})
export class ButtonAddComponent {

  faPlus = faPlus;
  
  @Output() action = new EventEmitter<void>();

  constructor() {
    // Puedes inicializar cualquier lógica aquí si es necesario
  } 

  ngOnInit(): void {
    // Aquí puedes realizar cualquier inicialización adicional si es necesario
  }

    clickButton() {
    this.action.emit();
    // this.disabled = true; // Disable the button after click
  }

}
