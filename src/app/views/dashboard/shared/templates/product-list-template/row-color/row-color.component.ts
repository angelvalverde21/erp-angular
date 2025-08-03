import { Component, Input } from '@angular/core';
import { environment } from '../../../../../../core/environments/environment';

@Component({
  selector: 'app-row-color',
  imports: [],
  templateUrl: './row-color.component.html',
  styleUrl: './row-color.component.scss'
})
export class RowColorComponent {

  @Input() product: any; 
  
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = environment.imageThumbnailPlaceHolderVertical;
  }
  
}
