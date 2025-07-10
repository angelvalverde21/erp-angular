import { Component } from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { CategoryCreateComponent } from "../category-create/category-create.component";

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



}
