import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyProductPriceIndexComponent } from './shopify-product-price-index.component';

describe('ShopifyProductPriceIndexComponent', () => {
  let component: ShopifyProductPriceIndexComponent;
  let fixture: ComponentFixture<ShopifyProductPriceIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyProductPriceIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyProductPriceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
