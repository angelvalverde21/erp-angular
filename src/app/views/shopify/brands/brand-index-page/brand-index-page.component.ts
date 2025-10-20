import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { faPlus, faLink, faEdit } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BrandService } from '../brand.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brand-index-page',
  imports: [LoadingComponent, ButtonLinkComponent],
  templateUrl: './brand-index-page.component.html',
  styleUrl: './brand-index-page.component.scss'
})
export class BrandIndexPageComponent implements OnDestroy, OnInit {

  faPlus = faPlus;
  faEdit = faEdit;
  faLink = faLink;

  brands: any[] = [];
  loading: boolean = false;

    constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
     private _brand: BrandService,
  ) {
  
  }
  
  subscriptionIndex! : Subscription;

  ngOnInit(): void {

    this.loading = true;

    this.subscriptionIndex = this._brand.index().subscribe({
      next: (resp: any) => {
        this.loading = false;
        console.log(resp);
        this.brands = resp.data;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error fetching brands:', err);
      }
    });

  }

  ngOnDestroy(): void {
  
    if(this.subscriptionIndex){
      this.subscriptionIndex.unsubscribe();
    }
  
  }

}
