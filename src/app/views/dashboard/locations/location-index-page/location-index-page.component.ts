import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocationService } from '../location.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule, JsonPipe, NgTemplateOutlet } from '@angular/common';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonEditComponent } from 'src/app/views/shared/components/buttons/button-edit/button-edit.component';

@Component({
  selector: 'app-location-index-page',
  imports: [
    NgTemplateOutlet,
    CommonModule,
    LoadingComponent,
    JsonPipe,
    FontAwesomeModule,
    ButtonEditComponent
  ],
  templateUrl: './location-index-page.component.html',
  styleUrl: './location-index-page.component.scss'
})
export class LocationIndexPageComponent implements OnInit, OnDestroy{

  locations:  any[] = [];
  loading: boolean = false;
  faHome = faHome;

  constructor(
    private _location: LocationService
  ){
  
  }

  ngOnInit(): void {

    this.loading = true;
    
    this._location.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.locations = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}
