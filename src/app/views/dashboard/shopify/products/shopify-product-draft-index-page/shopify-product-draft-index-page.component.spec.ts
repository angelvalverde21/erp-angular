import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyProductDraftIndexPageComponent } from './shopify-product-draft-index-page.component';

describe('ShopifyProductDraftIndexPageComponent', () => {
  let component: ShopifyProductDraftIndexPageComponent;
  let fixture: ComponentFixture<ShopifyProductDraftIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyProductDraftIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyProductDraftIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
