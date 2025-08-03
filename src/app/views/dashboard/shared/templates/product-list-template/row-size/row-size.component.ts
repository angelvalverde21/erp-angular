import { Component, Input } from '@angular/core';
import { environment } from '../../../../../../core/environments/environment';

@Component({
  selector: 'app-row-size',
  imports: [],
  templateUrl: './row-size.component.html',
  styleUrl: './row-size.component.scss'
})
export class RowSizeComponent {

  @Input() product: any; 
  
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = environment.imageThumbnailPlaceHolderVertical;
  }

}
