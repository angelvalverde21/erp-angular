import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from "../../loading/loading.component";
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-button-save',
  imports: [
    LoadingComponent,
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './button-save.component.html',
  styleUrl: './button-save.component.scss'
})
export class ButtonSaveComponent {

  @Input() color: string = "primary";
  @Input() separation: string = "2";
  @Input() colortext: string = "";
  @Input() size: string = 'sm';
  @Input() icon: any; //es posible que ya nose use esta propiedad porque usaremos faSave
  @Input() disabled: boolean = false;
  @Input() spinner: boolean = false;

  faSave = faSave;

  @Output() action = new EventEmitter<void>();

  clickButton() {
    this.action.emit();
    // this.disabled = true; // Disable the button after click
  }

}
