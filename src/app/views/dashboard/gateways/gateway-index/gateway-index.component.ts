import { Component, Input } from '@angular/core';
import { GatewayIndexRowComponent } from '../gateway-index-row/gateway-index-row.component';

@Component({
  selector: 'app-gateway-index',
  imports: [
    GatewayIndexRowComponent,
  ],
  templateUrl: './gateway-index.component.html',
  styleUrl: './gateway-index.component.scss'
})
export class GatewayIndexComponent {

  @Input() gateways: any[] = []; 

}
