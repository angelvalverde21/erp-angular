import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardImgDirective,
  CardTextDirective,
  CardTitleDirective,
  ColDirective,
  PlaceholderAnimationDirective,
  PlaceholderDirective
} from '@coreui/angular';

@Component({
  selector: 'app-card-place-holder',
  imports: [
    CardComponent,
    CardImgDirective,
    CardBodyComponent,
    CardTitleDirective,
    CardTextDirective,
    ButtonDirective,
    ColDirective,
    RouterLink,
    PlaceholderAnimationDirective,
    PlaceholderDirective
  ],
  host: { class: 'd-flex justify-content-around p-3' },
  templateUrl: './card-place-holder.component.html',
  styleUrl: './card-place-holder.component.scss'
})
export class CardPlaceHolderComponent {

}
