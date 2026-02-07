import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gateway-index',
  imports: [],
  templateUrl: './gateway-index.component.html',
  styleUrl: './gateway-index.component.scss'
})
export class GatewayIndexComponent {

  @Input() gateways: any[] = []; 

}
