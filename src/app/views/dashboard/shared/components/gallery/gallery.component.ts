import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { UploadDropzoneComponent } from '../../upload-dropzone/upload-dropzone.component';
import {
  NgbCarouselModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear, faImages, faImage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from '../../../dashboard.service';
import { Subscription } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
@Component({
  selector: 'app-gallery',
  imports: [
    UploadDropzoneComponent,
    NgbCarouselModule,
    CommonModule,
    FontAwesomeModule,
    UploadDropzoneComponent,
    LoadingComponent
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

  constructor( private _dashboard : DashboardService
  ) {

  }

  ngOnInit(): void {
    this.loading = true;
    this._dashboard.getGallery(this.path + '/images').subscribe((resp:any) => {
      this.images = resp.data;
      this.loading = false;
      console.log(resp);
      
    });
  }

  ngOnDestroy(): void {
    if(this.gallerySubscription){
      this.gallerySubscription.unsubscribe(); 
    }
  }
  closeModal() {

  }


  
}
