import { Component } from '@angular/core';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { SizesComponent } from './sizes/sizes.component';

@Component({
  selector: 'app-product-colors',
  imports: [GalleryComponent, NgbAccordionModule, SizesComponent],
  templateUrl: './product-colors.component.html',
  styleUrl: './product-colors.component.scss'
})
export class ProductColorsComponent {

    items = ['First', 'Second', 'Third'];
    
}
