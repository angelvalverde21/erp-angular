import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPurchaseIndexComponent } from './production-purchase-index.component';

describe('ProductionPurchaseIndexComponent', () => {
  let component: ProductionPurchaseIndexComponent;
  let fixture: ComponentFixture<ProductionPurchaseIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionPurchaseIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionPurchaseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
