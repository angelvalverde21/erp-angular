import { Component, Input, OnInit } from '@angular/core';
import { OptionCreateComponent } from '../option-create/option-create.component';
@Component({
  selector: 'app-option-index',
  imports: [
    OptionCreateComponent
  ],
  templateUrl: './option-index.component.html',
  styleUrl: './option-index.component.scss'
})
export class OptionIndexComponent implements OnInit {

  @Input() options_init: any;
  @Input() product_id: number = 0; 

  
  ngOnInit(): void {
  }

}
