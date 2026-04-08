import { Component } from '@angular/core';
import { BatchCreateComponent } from '../batch-create/batch-create.component';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonBackComponent } from 'src/app/views/shared/components/buttons/button-back/button-back.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-batch-create-page',
  imports: [
    BatchCreateComponent,
    HeadPageComponent,
    ButtonBackComponent
  ],
  templateUrl: './batch-create-page.component.html',
  styleUrl: './batch-create-page.component.scss'
})
export class BatchCreatePageComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }
  // batch: any;

  receiveBatchCreate(batch: any) {

    console.log('Lote creado:', batch);

    if (batch) {
      this.router.navigate(['../', batch.id], { relativeTo: this.route });
    }
    
  }


}
