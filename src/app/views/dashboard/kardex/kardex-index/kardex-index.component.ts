import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kardex-index',
  imports: [
    JsonPipe
  ],
  templateUrl: './kardex-index.component.html',
  styleUrl: './kardex-index.component.scss'
})
export class KardexIndexComponent {


  @Input() variants: any[] = [];

}
