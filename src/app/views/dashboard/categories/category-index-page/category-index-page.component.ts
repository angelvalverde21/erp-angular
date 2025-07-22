import { Component } from '@angular/core';
import { CategoryService } from '../category.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-category-index-page',
  imports: [
    LoadingComponent,
    CommonModule,
    ButtonLinkComponent,
    FontAwesomeModule
  ],
  templateUrl: './category-index-page.component.html',
  styleUrl: './category-index-page.component.scss'
})

export class CategoryIndexPageComponent {

  constructor(private _category: CategoryService) { }

  faEdit = faEdit;
  faPlus = faPlus;

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

