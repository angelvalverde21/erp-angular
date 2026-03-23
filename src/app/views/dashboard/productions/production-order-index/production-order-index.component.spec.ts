import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderIndexComponent } from './production-order-index.component';

describe('ProductionOrderIndexComponent', () => {
  let component: ProductionOrderIndexComponent;
  let fixture: ComponentFixture<ProductionOrderIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionOrderIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionOrderIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
