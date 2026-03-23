import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyCardOrderIndexComponent } from './shopify-card-order-index.component';

describe('ShopifyCardOrderIndexComponent', () => {
  let component: ShopifyCardOrderIndexComponent;
  let fixture: ComponentFixture<ShopifyCardOrderIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyCardOrderIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyCardOrderIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
