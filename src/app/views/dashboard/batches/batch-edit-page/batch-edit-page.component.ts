import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SectionService } from '../batch-sections/section.service';
import { Subject, takeUntil } from 'rxjs';
import { BatchEditComponent } from '../batch-edit/batch-edit.component';


@Component({
  selector: 'app-batch-edit-page',
  imports: [
    BatchEditComponent
  ],
  templateUrl: './batch-edit-page.component.html',
  styleUrl: './batch-edit-page.component.scss'
})
export class BatchEditPageComponent implements OnInit {

  batch_id: number | null = null;

  
  constructor(private route: ActivatedRoute, private _section: SectionService) {
    this.route.params.subscribe((params) => {
      this.batch_id = params['batch_id'];
    });
  }

  sections: any[] = [];
  loading: boolean = false;

  ngOnInit(): void {

  }

  destroy$ = new Subject<void>();
  
  getSections(){
        this._section.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.sections = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        console.error(error);
      },
    
    });
  }

}
