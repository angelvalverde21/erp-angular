import { Component, Input } from '@angular/core';
import { environment } from '../../../../../../core/environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-row-color-size',
  imports: [CommonModule],
  templateUrl: './row-color-size.component.html',
  styleUrl: './row-color-size.component.scss'
})
export class RowColorSizeComponent {

  @Input() product: any; 
  
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = environment.imageThumbnailPlaceHolderVertical;
  }

}
