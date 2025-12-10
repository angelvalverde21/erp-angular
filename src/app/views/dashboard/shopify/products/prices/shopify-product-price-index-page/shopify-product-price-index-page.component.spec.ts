import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyProductPriceIndexPageComponent } from './shopify-product-price-index-page.component';

describe('ShopifyProductPriceIndexPageComponent', () => {
  let component: ShopifyProductPriceIndexPageComponent;
  let fixture: ComponentFixture<ShopifyProductPriceIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyProductPriceIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyProductPriceIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
