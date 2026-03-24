import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionVariantRowComponent } from './production-variant-row.component';

describe('ProductionVariantRowComponent', () => {
  let component: ProductionVariantRowComponent;
  let fixture: ComponentFixture<ProductionVariantRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionVariantRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionVariantRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
