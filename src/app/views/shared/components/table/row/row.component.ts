import { Component, Input } from '@angular/core';

@Component({
  selector: 'tr[app-row]',
  imports: [],
  templateUrl: './row.component.html',
  styleUrl: './row.component.scss'
})
export class RowComponent {

  @Input() item: any = {}; 

}
