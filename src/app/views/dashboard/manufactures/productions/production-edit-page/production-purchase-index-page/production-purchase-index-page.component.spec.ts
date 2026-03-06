import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPurchaseIndexPageComponent } from './production-purchase-index-page.component';

describe('ProductionPurchaseIndexPageComponent', () => {
  let component: ProductionPurchaseIndexPageComponent;
  let fixture: ComponentFixture<ProductionPurchaseIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionPurchaseIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionPurchaseIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
