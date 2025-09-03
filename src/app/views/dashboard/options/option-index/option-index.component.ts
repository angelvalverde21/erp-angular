import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-option-index',
  imports: [    
  ],
  templateUrl: './option-index.component.html',
  styleUrl: './option-index.component.scss'
})
export class OptionIndexComponent {

  @Input() options : any[] = []; 

}
