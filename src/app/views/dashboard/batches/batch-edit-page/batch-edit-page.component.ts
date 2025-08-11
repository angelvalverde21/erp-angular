import { Component } from '@angular/core';
import { BatchEditComponent } from '../batch-edit/batch-edit.component';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-batch-edit-page',
  imports: [
    BatchEditComponent, 
    FontAwesomeModule
  ],
  templateUrl: './batch-edit-page.component.html',
  styleUrl: './batch-edit-page.component.scss'
})
export class BatchEditPageComponent {

  batch_id: number | null = null;
  faPenToSquare = faPenToSquare;
  
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe((params) => {
      this.batch_id = params['batch_id'];
    });
  }
  

}
