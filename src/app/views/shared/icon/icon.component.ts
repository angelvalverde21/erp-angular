import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-icon',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {


  @Input() icon: any; 
  @Input() me: number = 2; //margin end

}
