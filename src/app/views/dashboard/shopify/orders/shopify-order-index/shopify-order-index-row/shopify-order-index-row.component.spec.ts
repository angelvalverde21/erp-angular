import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyOrderIndexRowComponent } from './shopify-order-index-row.component';

describe('ShopifyOrderIndexRowComponent', () => {
  let component: ShopifyOrderIndexRowComponent;
  let fixture: ComponentFixture<ShopifyOrderIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyOrderIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyOrderIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
