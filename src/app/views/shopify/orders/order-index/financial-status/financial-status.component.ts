import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-financial-status',
  imports: [],
  templateUrl: './financial-status.component.html',
  styleUrl: './financial-status.component.scss'
})
export class FinancialStatusComponent {

  @Input() status: string = ""; 

}
