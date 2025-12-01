import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPriceMainEditComponent } from './product-price-main-edit.component';

describe('ProductPriceMainEditComponent', () => {
  let component: ProductPriceMainEditComponent;
  let fixture: ComponentFixture<ProductPriceMainEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPriceMainEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPriceMainEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
