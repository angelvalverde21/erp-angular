import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderCashPageComponent } from './shopify-order-cash-page.component';

describe('ShopifyOrderCashPageComponent', () => {
  let component: ShopifyOrderCashPageComponent;
  let fixture: ComponentFixture<ShopifyOrderCashPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderCashPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderCashPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
