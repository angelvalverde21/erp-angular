import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-batch-index',
  imports: [
    RouterModule
  ],
  templateUrl: './batch-index.component.html',
  styleUrl: './batch-index.component.scss'
})
export class BatchIndexComponent {


  @Input() batches: any[] = []; 

}
