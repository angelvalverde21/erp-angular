import { Component, Input } from '@angular/core';
import { SpinnerComponent } from '@coreui/angular';

@Component({
  selector: 'app-loading',
  imports: [SpinnerComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  @Input() size: string = 'md'; 
  @Input() color: string = "dark"; 
}
