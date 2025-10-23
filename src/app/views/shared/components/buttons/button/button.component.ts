import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from "../../loading/loading.component";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button',
  imports: [LoadingComponent, CommonModule, FontAwesomeModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  @Input() color: string = "dark"; 
  @Input() separation: string = "2"; 
  @Input() colortext: string = ""; 
  @Input() size: string = 'sm';
  @Input() icon: any; 
  @Input() disabled: boolean = false;
  @Input() spinner: boolean = false;
  

  @Output() action = new EventEmitter<void>();
  
  clickButton() {
    this.action.emit();
    // this.disabled = true; // Disable the button after click
  }
  
}
