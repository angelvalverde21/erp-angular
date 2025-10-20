import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-button-login',
  imports: [LoadingComponent, CommonModule, FontAwesomeModule],
  templateUrl: './button-login.component.html',
  styleUrl: './button-login.component.scss'
})
export class ButtonLoginComponent {

    // faLock = faLock;
    // icon = faLock;
    // Default values for the button
    // faLock = faLock; // Default icon

    icon = faLock; 
    @Input() disabled: boolean = false;
    @Input() loadingIcon: boolean = false;
    
  
    @Output() clickCustom = new EventEmitter<void>();
    
    clickButton() {
  
      // this.loadingIcon = true; // Start loading icon
      this.clickCustom.emit();
      // this.disabled = true; // Disable the button after click
    }

}
