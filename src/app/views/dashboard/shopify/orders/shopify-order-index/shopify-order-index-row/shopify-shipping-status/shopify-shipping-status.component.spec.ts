import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyShippingStatusComponent } from './shopify-shipping-status.component';

describe('ShopifyShippingStatusComponent', () => {
  let component: ShopifyShippingStatusComponent;
  let fixture: ComponentFixture<ShopifyShippingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyShippingStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyShippingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
