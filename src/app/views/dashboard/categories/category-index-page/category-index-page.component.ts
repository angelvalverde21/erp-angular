import { Component } from '@angular/core';
import { CategoryService } from '../category.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { DateCustomPipe } from '../../shared/pipes/date-custom.pipe';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-category-index-page',
  imports: [
    LoadingComponent,
    CommonModule,
    DateCustomPipe,
    ButtonLinkComponent
  ],
  templateUrl: './category-index-page.component.html',
  styleUrl: './category-index-page.component.scss'
})

export class CategoryIndexPageComponent {

  constructor(private _category: CategoryService) { }

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

