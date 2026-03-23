import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-widget',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss'
})
export class WidgetComponent {

  @Input() title: string = '';
  @Input() color: string = '';
  @Input() value: number | string = 0;
  @Input() subtitle: string = '';
  @Input() icon: any;

}
