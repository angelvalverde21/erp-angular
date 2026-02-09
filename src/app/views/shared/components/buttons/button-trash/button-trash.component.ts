import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from "../../loading/loading.component";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-trash',
  imports: [
    LoadingComponent, 
    CommonModule, 
    FontAwesomeModule
  ],
  
  templateUrl: './button-trash.component.html',
  styleUrl: './button-trash.component.scss'
})
export class ButtonTrashComponent {

  @Input() color: string = "danger"; 
  @Input() separation: string = "2"; 
  @Input() colortext: string = "white"; 
  @Input() size: string = 'sm';
  @Input() icon: any = faTrash; 
  @Input() disabled: boolean = false;
  @Input() spinner: boolean = false;
  @Input() me: boolean = false; //margin end
  

  @Output() action = new EventEmitter<void>();

  clickButton() {
    this.action.emit();
    // this.disabled = true; // Disable the button after click
  }
  
}
