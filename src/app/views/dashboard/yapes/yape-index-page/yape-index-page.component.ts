import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { YapeService } from '../yapeservice';
import { YapeIndexComponent } from '../yape-index/yape-index.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { HeadPageComponent } from '../../../shared/components/head-page/head-page.component';

@Component({
  selector: 'app-yape-index-page',
  imports: [
    YapeIndexComponent,
    LoadingComponent,
    HeadPageComponent
  ],
  templateUrl: './yape-index-page.component.html',
  styleUrl: './yape-index-page.component.scss'
})
export class YapeIndexPageComponent implements OnInit, OnDestroy{


  yapes: any[] = [];

  constructor(
    private _yape: YapeService
  ){
  
  }

  loading: boolean = false;

  ngOnInit(): void {

    this.yapesInit();

  }

  yapesInit(){
    this.loading = true;

    this._yape.index().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.yapes = resp.data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.loading = false;
      }
    });

  }
  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}
