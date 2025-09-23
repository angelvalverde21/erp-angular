import { Component, Input } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryComponent } from '../../shared/components/gallery/gallery.component';
import { Color } from '../../../../interfaces/color.interface';

@Component({
  selector: 'app-color-row',
  imports: [NgbAccordionModule, GalleryComponent],
  templateUrl: './color-row.component.html',
  styleUrl: './color-row.component.scss'
})
export class ColorRowComponent {

  @Input() item!: string;
  @Input() collapsed = true;
  @Input() color!: Color;

}
