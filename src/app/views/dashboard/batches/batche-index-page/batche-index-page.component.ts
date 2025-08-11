import { Component} from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { BatcheIndexComponent } from '../batche-index/batche-index.component';

@Component({
  selector: 'app-batche-index-page',
  imports: [ButtonLinkComponent, BatcheIndexComponent],
  templateUrl: './batche-index-page.component.html',
  styleUrl: './batche-index-page.component.scss'
})
export class BatcheIndexPageComponent {
  faPlus = faPlus;

}
