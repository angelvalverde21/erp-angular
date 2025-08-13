import { Component } from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { BatchCreateComponent } from '../batch-create/batch-create.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-batch-create-page',
  imports: [BatchCreateComponent, ButtonLinkComponent],
  templateUrl: './batch-create-page.component.html',
  styleUrl: './batch-create-page.component.scss'
})
export class BatchCreatePageComponent {

    faArrowLeft = faArrowLeft;

    constructor(private router: Router){
    
    }
  
    receiveBatchCreate(batch: any) {
      if (batch) {
        this.router.navigate(['batches', batch.id]);
      }
    }

}
