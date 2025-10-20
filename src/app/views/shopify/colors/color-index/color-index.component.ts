import { Component, Input } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorRowComponent } from '../color-row/color-row.component';
import { AccordionBaseComponent } from '../../../shared/accordion-base/accordion-base.component';
import { ButtonComponent } from '../../../shared/components/buttons/button/button.component';
import { Color } from '../../../../interfaces/color.interface';


@Component({
  selector: 'app-color-index',
  imports: [NgbAccordionModule, ColorRowComponent, AccordionBaseComponent, ButtonComponent],
  templateUrl: './color-index.component.html',
  styleUrl: './color-index.component.scss'
})
export class ColorIndexComponent {
	items = ['First', 'Second', 'Third'];

  @Input() colors: Color[] = [];

}
