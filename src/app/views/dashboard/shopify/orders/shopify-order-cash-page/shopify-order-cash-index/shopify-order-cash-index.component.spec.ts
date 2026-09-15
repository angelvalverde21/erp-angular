import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderCashIndexComponent } from './shopify-order-cash-index.component';

describe('ShopifyOrderCashIndexComponent', () => {
  let component: ShopifyOrderCashIndexComponent;
  let fixture: ComponentFixture<ShopifyOrderCashIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderCashIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderCashIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
