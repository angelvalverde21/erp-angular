import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderPendingPageComponent } from './shopify-order-pending-page.component';

describe('ShopifyOrderPendingPageComponent', () => {
  let component: ShopifyOrderPendingPageComponent;
  let fixture: ComponentFixture<ShopifyOrderPendingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderPendingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderPendingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
