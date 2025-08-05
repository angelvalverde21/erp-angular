import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UploadDropzoneComponent } from '../../../shared/upload-dropzone/upload-dropzone.component';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';

@Component({
  selector: 'app-colors',
  imports: [JsonPipe, CommonModule, UploadDropzoneComponent, GalleryComponent],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss'
})
export class ColorsComponent {

  @Input() colors: any[] = []; 
  @Input() has_size: boolean = false;

}
