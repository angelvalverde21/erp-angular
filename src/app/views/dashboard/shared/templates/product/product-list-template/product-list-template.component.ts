import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../../../core/environments/environment';
import { CommonModule, JsonPipe } from '@angular/common';
import { ButtonLinkComponent } from '../../../components/buttons/button-link/button-link.component';


@Component({
  selector: 'app-product-list-template',
  imports: [FontAwesomeModule, CommonModule, ButtonLinkComponent],
  templateUrl: './product-list-template.component.html',
  styleUrl: './product-list-template.component.scss'
})
export class ProductListTemplateComponent {

  faEdit = faEdit;

  @Input() products: any[] = []; 
  
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = environment.imageThumbnailPlaceHolderVertical;
  }

}
