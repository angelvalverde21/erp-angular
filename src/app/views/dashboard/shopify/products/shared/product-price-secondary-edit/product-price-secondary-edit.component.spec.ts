import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPriceSecondaryEditComponent } from './product-price-secondary-edit.component';

describe('ProductPriceSecondaryEditComponent', () => {
  let component: ProductPriceSecondaryEditComponent;
  let fixture: ComponentFixture<ProductPriceSecondaryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPriceSecondaryEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPriceSecondaryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
