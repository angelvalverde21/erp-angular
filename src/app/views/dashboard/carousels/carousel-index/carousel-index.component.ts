import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarouselService } from '../carousel.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faEdit, faLink, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-carousel-index',
  imports: [LoadingComponent, ButtonLinkComponent],
  templateUrl: './carousel-index.component.html',
  styleUrl: './carousel-index.component.scss'
})
export class CarouselIndexComponent  implements OnInit, OnDestroy {

  subscriptionCarousel!: Subscription;
  carousels: any[] = [];
  loading: boolean = false;

  faEdit = faEdit;
  faLink = faLink;
  faTrash = faTrash;

  constructor(private _carousel: CarouselService) {}

  ngOnInit(): void {
    this.initCarousels();
  }

  initCarousels(){
    this.loading = true;
    this.subscriptionCarousel = this._carousel.index().subscribe({
      next: (resp:any) => {
        this.loading = false;
        this.carousels = resp.data;
        console.log(this.carousels);
      },
      error: (error) => {
        this.loading = false;
        console.error('Ha ocurrido un error interno!', error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionCarousel) {
      this.subscriptionCarousel.unsubscribe();
    }
  }

}
