import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionVariantIndexRowComponent } from './production-variant-index-row.component';

describe('ProductionVariantIndexRowComponent', () => {
  let component: ProductionVariantIndexRowComponent;
  let fixture: ComponentFixture<ProductionVariantIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionVariantIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionVariantIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
