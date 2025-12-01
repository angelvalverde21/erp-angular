import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderIndexPendingComponent } from './shopify-order-index-pending.component';

describe('ShopifyOrderIndexPendingComponent', () => {
  let component: ShopifyOrderIndexPendingComponent;
  let fixture: ComponentFixture<ShopifyOrderIndexPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderIndexPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderIndexPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
