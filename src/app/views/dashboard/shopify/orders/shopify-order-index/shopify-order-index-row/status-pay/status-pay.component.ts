import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-pay',
  imports: [],
  templateUrl: './status-pay.component.html',
  styleUrl: './status-pay.component.scss',
})
export class StatusPayComponent {
  @Input() status: any;
}
