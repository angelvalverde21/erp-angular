import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shopify-tags',
  imports: [],
  templateUrl: './shopify-tags.component.html',
  styleUrl: './shopify-tags.component.scss'
})
export class ShopifyTagsComponent {

  @Input() tags: string[] = []; 

}
