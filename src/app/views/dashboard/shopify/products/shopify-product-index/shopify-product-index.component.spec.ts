import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyProductIndexComponent } from './shopify-product-index.component';

describe('ShopifyProductIndexComponent', () => {
  let component: ShopifyProductIndexComponent;
  let fixture: ComponentFixture<ShopifyProductIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyProductIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyProductIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
