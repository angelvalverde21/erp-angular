import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { ProductListTemplateComponent } from '../../../shared/templates/product-list-template/product-list-template.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-index-slug-page',
  imports: [LoadingComponent, ButtonLinkComponent, ProductListTemplateComponent, CommonModule],
  templateUrl: './category-index-slug-page.component.html',
  styleUrl: './category-index-slug-page.component.scss',
})
export class CategoryIndexSlugPageComponent implements OnInit {
  slug: string | null = null;
  loading: boolean = false;
  faPlus = faPlus;

  constructor(
    private _category: CategoryService,
    private route: ActivatedRoute
  ) {}

  // Se pueden agregar métodos y propiedades adicionales aquí
  // Este componente se utiliza para mostrar categorías según el slug
  // Aquí se puede implementar la lógica para obtener y mostrar categorías por slug
  products: any[] = [];

  ngOnInit(): void {
    // Lógica de inicialización, como obtener datos según el slug

    this.route.params.subscribe((params) => {
      this.loading = true;

      console.log('imprimiendo parametros from');
      console.log(params);
      this.slug = params['slug'];
      console.log(this.slug);

      this._category
        .showProductBySlug(this.slug)
        .subscribe((resp: any) => {
          console.log(resp);
          this.products = resp.data;
          this.loading = false;
          // Manejar los datos de la respuesta, por ejemplo, asignarlos a una propiedad para usarlos en la plantilla
        });
    });
  }
}
