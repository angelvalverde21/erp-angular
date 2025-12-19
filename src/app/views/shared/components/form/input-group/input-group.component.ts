import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-input-group',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './input-group.component.html',
})
export class InputGroupComponent{

  
  @Input() icon: IconDefinition | null = null;
  @Input() icontext: string = '';
  @Input() text: string = '';
  @Input() col: string = '';
  @Input() mb: number = 3;
  @Input() error: string = "";

  get hasIcon(): boolean {
    return !!this.icon || !!this.icontext;
  }

}
