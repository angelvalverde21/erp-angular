import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionVariantIndexComponent } from './production-variant-index.component';

describe('ProductionVariantIndexComponent', () => {
  let component: ProductionVariantIndexComponent;
  let fixture: ComponentFixture<ProductionVariantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionVariantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionVariantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
