import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderPreparedPageComponent } from './shopify-order-prepared-page.component';

describe('ShopifyOrderPreparedPageComponent', () => {
  let component: ShopifyOrderPreparedPageComponent;
  let fixture: ComponentFixture<ShopifyOrderPreparedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderPreparedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderPreparedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
