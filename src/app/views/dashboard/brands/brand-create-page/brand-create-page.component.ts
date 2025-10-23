import { Component, OnInit } from '@angular/core';
import { BrandCreateComponent } from '../brand-create/brand-create.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-create-page',
  imports: [BrandCreateComponent],
  templateUrl: './brand-create-page.component.html',
  styleUrl: './brand-create-page.component.scss'
})
export class BrandCreatePageComponent implements OnInit{

  ngOnInit(): void {
  }

  constructor(private _router: Router){
  
  }

  receiveBrandCreate(brand: any){
    // console.log('Brand created:', brand);

    if (brand) {
          this._router.navigate(['/', 'brands']);
    }

  }

}
