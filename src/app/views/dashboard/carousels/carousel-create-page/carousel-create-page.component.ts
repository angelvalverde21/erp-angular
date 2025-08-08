import { Component } from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { CarouselCreateComponent } from '../../carousels/carousel-create/carousel-create.component';
@Component({
  selector: 'app-carousel-create-page',
  imports: [ButtonLinkComponent, CarouselCreateComponent],
  templateUrl: './carousel-create-page.component.html',
  styleUrl: './carousel-create-page.component.scss'
})
export class CarouselCreatePageComponent {

  faArrowLeft = faArrowLeft;
  
}
