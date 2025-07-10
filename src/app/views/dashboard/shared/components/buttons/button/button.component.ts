import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from "../../loading/loading.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [LoadingComponent, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  @Input() color: string = "dark"; 
  @Input() colortext: string = ""; 
  @Input() icon: string | null = null; 
  @Input() disabled: boolean = false;
  @Input() loadingIcon: boolean = false;
  

  @Output() action = new EventEmitter<void>();
  
  clickButton() {
    this.action.emit();
    // this.disabled = true; // Disable the button after click
  }
  
}
