import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyProductPriceSearchPageComponent } from './shopify-product-price-search-page.component';

describe('ShopifyProductPriceSearchPageComponent', () => {
  let component: ShopifyProductPriceSearchPageComponent;
  let fixture: ComponentFixture<ShopifyProductPriceSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyProductPriceSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyProductPriceSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
