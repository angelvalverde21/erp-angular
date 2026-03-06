import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionVariantIndexPageComponent } from './production-variant-index-page.component';

describe('ProductionVariantIndexPageComponent', () => {
  let component: ProductionVariantIndexPageComponent;
  let fixture: ComponentFixture<ProductionVariantIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionVariantIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionVariantIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
