import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyProductIndexPageComponent } from './shopify-product-index-page.component';

describe('ShopifyProductIndexPageComponent', () => {
  let component: ShopifyProductIndexPageComponent;
  let fixture: ComponentFixture<ShopifyProductIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyProductIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyProductIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
