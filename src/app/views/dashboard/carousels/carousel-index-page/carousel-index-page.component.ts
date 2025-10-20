import { Component } from '@angular/core';
import { CarouselIndexComponent } from '../carousel-index/carousel-index.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-carousel-index-page',
  imports: [CarouselIndexComponent, ButtonLinkComponent],
  templateUrl: './carousel-index-page.component.html',
  styleUrl: './carousel-index-page.component.scss',
})
export class CarouselIndexPageComponent{

  faPlus = faPlus;

}
