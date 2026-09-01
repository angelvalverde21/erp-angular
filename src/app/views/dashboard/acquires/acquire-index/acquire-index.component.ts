import { Component, Input } from '@angular/core';
import { AcquireIndexRowComponent } from '../acquire-index-row/acquire-index-row.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-acquire-index',
  imports: [
    AcquireIndexRowComponent,
    CommonModule
  ],
  templateUrl: './acquire-index.component.html',
  styleUrl: './acquire-index.component.scss'
})
export class AcquireIndexComponent {

  @Input() acquires: any; 

}
