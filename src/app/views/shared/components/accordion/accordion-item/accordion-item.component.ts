import { Component, Input } from '@angular/core';
import {
  NgbAccordionItem,
  NgbAccordionHeader,
  NgbAccordionCollapse,
  NgbAccordionBody,
  NgbAccordionModule
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'div[appAccordionItem]',
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionCollapse,
    NgbAccordionBody
  ],
  hostDirectives: [NgbAccordionItem],
  template: `
    <div ngbAccordionHeader class="accordion-button">
      {{ title }}
    </div>

    <div ngbAccordionCollapse="ngbAccordionCollapse">
      <div ngbAccordionBody>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class AccordionItemComponent {

  @Input() title!: string;

}