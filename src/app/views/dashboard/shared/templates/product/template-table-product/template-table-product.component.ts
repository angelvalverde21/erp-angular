import { Component, Input } from '@angular/core';
import { 
  CardBodyComponent, 
  TableDirective, 
} from '@coreui/angular';
import { CommonModule } from '@angular/common';
// import { environment } from '@env/environment';
import { DropDownActionsComponent } from "./drop-down-actions/drop-down-actions.component";
import { APP_PIPES } from '../../../pipes/index.pipe'; // Adjust the import path as necessary
import { environment } from '../../../../../../core/environments/environment'; // Adjust the import path as necessary

@Component({
  selector: 'app-template-table-product',
  imports: [
    CardBodyComponent,
    TableDirective,
    CommonModule,
    APP_PIPES,
    DropDownActionsComponent
],
  templateUrl: './template-table-product.component.html',
  styleUrl: './template-table-product.component.scss'
})

export class TemplateTableProductComponent {

  @Input() products: any[] = []; 

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = environment.imageThumbnailPlaceHolderVertical;
  }

}
