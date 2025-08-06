import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';

@Component({
  selector: 'app-colors',
  imports: [JsonPipe, CommonModule, GalleryComponent],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss'
})
export class ColorsComponent {

  @Input() colors: any[] = []; 
  @Input() has_size: boolean = false;

}
