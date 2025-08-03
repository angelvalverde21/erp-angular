import { Component, Input } from '@angular/core';
import { environment } from '../../../../../../core/environments/environment';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-row-product',
  imports: [JsonPipe, CommonModule],
  templateUrl: './row-product.component.html',
  styleUrl: './row-product.component.scss'
})
export class RowProductComponent {

  @Input() product: any; 
  
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = environment.imageThumbnailPlaceHolderVertical;
  }

}
