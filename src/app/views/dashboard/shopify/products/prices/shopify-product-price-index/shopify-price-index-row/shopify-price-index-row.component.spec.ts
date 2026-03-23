import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyPriceIndexRowComponent } from './shopify-price-index-row.component';

describe('ShopifyPriceIndexRowComponent', () => {
  let component: ShopifyPriceIndexRowComponent;
  let fixture: ComponentFixture<ShopifyPriceIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyPriceIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyPriceIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
