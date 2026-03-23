import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/interfaces/product.interface';
import { BaseService } from 'src/app/views/base.service';
import { ButtonEditComponent } from 'src/app/views/shared/components/buttons/button-edit/button-edit.component';
import { ButtonComponent } from 'src/app/views/shared/components/buttons/button/button.component';

@Component({
  selector: 'app-product-index',
  imports: [
    ButtonComponent,
    ButtonEditComponent
  ],
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss'
})
export class ProductIndexComponent implements AfterViewInit {

  faTrash = faTrash;
  faPen = faPen;

  /** funcion que detectas si se llego al final */

  @Output() loadMore = new EventEmitter<void>();

  @ViewChild('bottom', { static: true }) bottom!: ElementRef;

  observer!: IntersectionObserver;

  ngAfterViewInit(): void {

    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.loadMore.emit(); // 🔥 avisar al padre
      }
    });

    this.observer.observe(this.bottom.nativeElement);

  }

  /** fin funcion que detectas si se llego al final */

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _base: BaseService
  ) {

  }

  @Input() products: Product[] = [];

  getProduct(id: number) {
    this.router.navigate([this._base.store, 'dashboard', 'products', id]);
  }

}
