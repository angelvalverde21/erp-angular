import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-view-options',
  imports: [],
  templateUrl: './view-options.component.html',
  styleUrl: './view-options.component.scss'
})
export class ViewOptionsComponent {

  @Input() option: any[] = []; 

}
