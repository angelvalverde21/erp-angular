import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { ColorComponent } from './color/color.component';
import { environment } from '../../../../../core/environments/environment';

@Component({
  selector: 'app-colors',
<<<<<<< HEAD
  imports: [JsonPipe, CommonModule, GalleryComponent],
=======
  imports: [JsonPipe, CommonModule, UploadDropzoneComponent, GalleryComponent, ColorComponent],
>>>>>>> 9c06b31b1e8f6bd67fce69ad39454b70c57add49
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss'
})
export class ColorsComponent {

  showComponentName = environment.showComponentName;

  @Input() colors: any[] = []; 
  @Input() has_size: boolean = false;

}
