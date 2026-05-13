import { Component, Input } from '@angular/core';
import { YapeIndexRowComponent } from '../yape-index-row/yape-index-row.component';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-yape-index',
  imports: [
    YapeIndexRowComponent,
    DateShopifyPipe,
    CommonModule
  ],
  templateUrl: './yape-index.component.html',
  styleUrl: './yape-index.component.scss'
})
export class YapeIndexComponent {

  @Input() yapes: any[] = [];

}
