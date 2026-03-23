import { Component } from '@angular/core';
import { CategoryService } from '../category.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlus, faLink } from '@fortawesome/free-solid-svg-icons';
import { RouterModule } from '@angular/router';
import { CategoryIndexComponent } from '../category-index/category-index.component';
import { ButtonBackComponent } from '../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../shared/components/head-page/head-page.component";
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-index-page',
  imports: [
    LoadingComponent,
    ButtonLinkComponent,
    FontAwesomeModule,
    RouterModule,
    CategoryIndexComponent,
    ButtonBackComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    NgbAccordionModule
  ],
  templateUrl: './category-index-page.component.html',
  styleUrl: './category-index-page.component.scss'
})

export class CategoryIndexPageComponent {


  items = ['First', 'Second', 'Third'];

  constructor(private _category: CategoryService) { }

  faEdit = faEdit;
  faPlus = faPlus;
  faLink = faLink;

  categories: any[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    // Initialization logic here
    this._category.index().subscribe((resp: any) => {
      console.log(resp);
      this.categories = resp.data;
      this.loading = false;
    });
  }

  // Other methods and properties can be added here

}

