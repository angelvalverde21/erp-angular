import { Component} from '@angular/core';
import { ButtonLinkComponent } from '../../shared/components/buttons/button-link/button-link.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { BatchIndexComponent } from '../batch-index/batch-index.component';

@Component({
  selector: 'app-batch-index-page',
  imports: [ButtonLinkComponent, BatchIndexComponent],
  templateUrl: './batch-index-page.component.html',
  styleUrl: './batch-index-page.component.scss'
})
export class BatchIndexPageComponent {
  faPlus = faPlus;

}
