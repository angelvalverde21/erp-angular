import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderIndexComponent } from './shopify-order-index.component';

describe('ShopifyOrderIndexComponent', () => {
  let component: ShopifyOrderIndexComponent;
  let fixture: ComponentFixture<ShopifyOrderIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
