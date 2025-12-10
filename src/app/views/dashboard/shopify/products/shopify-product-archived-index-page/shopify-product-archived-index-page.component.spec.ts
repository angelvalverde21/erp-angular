import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyProductArchivedIndexPageComponent } from './shopify-product-archived-index-page.component';

describe('ShopifyProductArchivedIndexPageComponent', () => {
  let component: ShopifyProductArchivedIndexPageComponent;
  let fixture: ComponentFixture<ShopifyProductArchivedIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyProductArchivedIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyProductArchivedIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
