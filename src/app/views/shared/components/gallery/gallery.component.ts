import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { UploadDropzoneComponent } from '../../upload-dropzone/upload-dropzone.component';
import {
  NgbCarouselModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear, faImages, faImage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../../dashboard/dashboard.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { ImageComponent } from './image/image.component';

@Component({
  selector: 'app-gallery',
  imports: [
    UploadDropzoneComponent,
    NgbCarouselModule,
    CommonModule,
    FontAwesomeModule,
    UploadDropzoneComponent,
    LoadingComponent,
    ImageComponent
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GalleryComponent implements OnInit, OnDestroy {

  @Input() path: string = 'products/colors/store';

  faGear = faGear;
  faImages = faImages;
  faImage = faImage;
  faTrash = faTrash;
  images: any[] = [];

  @Input() thumbnail: string = 'https://picsum.photos/id/${n}/900/500'; 
  @Input() group_id: number = 0; 
  gallerySubscription! : Subscription;
  loading: boolean = false;

  @Output() lastFileUpload = new EventEmitter<any>();
  

  constructor( private _dashboard : DashboardService
  ) {

  }

  ngOnInit(): void {
    
    this.loading = true;

    this._dashboard.getGallery(this.path).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.images = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        console.error(error);
        this.loading = false;
      },
    
    });

  }


  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }
  
  closeModal() {

  }

  fileUpload(event: any) {
    console.log(event);
    this.images.unshift(event);
  }
  
  finishUpload(event: any){
    console.log(event);
    this.lastFileUpload.emit(event);
  }
  
  reListImages(id: any) {

    // this.images = this.images.filter((image) => image.id !== id);/
    console.log('Re-listing images after deletion of ID:', id);
    this.images = this.images.filter((image) => image.id !== id);

  }
}
