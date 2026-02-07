import { Component } from '@angular/core';
import { UserHeadTableComponent } from '../../users/shared/user-head-table/user-head-table.component';
import { PettyCashIndexComponent } from '../petty-cash-index/petty-cash-index.component';
import { HeadPageComponent } from '../../../shared/components/head-page/head-page.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

@Component({
  selector: 'app-petty-cash-index-page',
  imports: [
    UserHeadTableComponent,
    PettyCashIndexComponent,
    HeadPageComponent,
    ButtonLinkComponent,
    LoadingComponent
  ],
  templateUrl: './petty-cash-index-page.component.html',
  styleUrl: './petty-cash-index-page.component.scss'
})
export class PettyCashIndexPageComponent {

  loading: boolean = false;
  
  petty_cashes: any; // This should be replaced with the actual type and data fetching logic

  receiveSearchResult(petty_cashes: any) {
    // Handle search result
  }
}
