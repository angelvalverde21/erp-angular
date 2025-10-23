import { Component } from '@angular/core';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { CategoryCreateComponent } from "../category-create/category-create.component";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';


@Component({
  selector: 'app-category-create-page',
  imports: [
    ButtonLinkComponent,
    CategoryCreateComponent
],
  templateUrl: './category-create-page.component.html',
  styleUrl: './category-create-page.component.scss'
})
export class CategoryCreatePageComponent {

  faArrowLeft = faArrowLeft;

  constructor(private router: Router) { }

  // Additional methods and properties can be added here

  categoryCreate(category: any | boolean): void {

    if (category) {
      // Navigate to the category list or perform any other action
      this.router.navigate(['categories', category.id]);
    } else {
      // Handle the case where no category was created
      console.error('No category was created');
    }

  }

}
