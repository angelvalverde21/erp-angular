import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { ColorComponent } from './color/color.component';
import { environment } from '../../../../../core/environments/environment';

@Component({
  selector: 'app-colors',
  imports: [JsonPipe, CommonModule, GalleryComponent, ColorComponent],
  templateUrl: './colors.component.html',
  styleUrl: './colors.component.scss'
})
export class ColorsComponent {

  // showComponentName = environment.showComponentName;

  @Input() colors: any[] = []; 
  @Input() has_size: boolean = false;

}
