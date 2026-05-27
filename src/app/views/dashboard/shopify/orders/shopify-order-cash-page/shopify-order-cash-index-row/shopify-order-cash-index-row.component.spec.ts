import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderCashIndexRowComponent } from './shopify-order-cash-index-row.component';

describe('ShopifyOrderCashIndexRowComponent', () => {
  let component: ShopifyOrderCashIndexRowComponent;
  let fixture: ComponentFixture<ShopifyOrderCashIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderCashIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderCashIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
