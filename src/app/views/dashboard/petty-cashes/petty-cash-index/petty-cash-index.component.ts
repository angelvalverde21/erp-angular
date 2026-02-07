import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-petty-cash-index',
  imports: [],
  templateUrl: './petty-cash-index.component.html',
  styleUrl: './petty-cash-index.component.scss'
})
export class PettyCashIndexComponent {

  @Input() petty_cashes: any[] = []; 
}
