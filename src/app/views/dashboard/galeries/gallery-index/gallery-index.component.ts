import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-gallery-index',
  imports: [],
  templateUrl: './gallery-index.component.html',
  styleUrl: './gallery-index.component.scss'
})
export class GalleryIndexComponent {

  @Input() images: any; 

}
