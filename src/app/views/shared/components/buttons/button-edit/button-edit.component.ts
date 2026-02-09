import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from "../../loading/loading.component";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-edit',
  imports: [
    LoadingComponent, 
    CommonModule, 
    FontAwesomeModule
  ],
  
  templateUrl: './button-edit.component.html',
  styleUrl: './button-edit.component.scss'
})
export class ButtonEditComponent {

  @Input() color: string = "outline-dark"; 
  @Input() separation: string = "2"; 
  @Input() colortext: string = ""; 
  @Input() size: string = 'sm';
  @Input() icon: any = faEdit; 
  @Input() disabled: boolean = false;
  @Input() spinner: boolean = false;
  @Input() me: boolean = false; //margin end
  

  @Output() action = new EventEmitter<void>();
  
  clickButton() {
    this.action.emit();
    // this.disabled = true; // Disable the button after click
  }
  
}
