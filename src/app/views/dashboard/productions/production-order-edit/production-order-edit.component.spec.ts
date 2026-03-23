import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderEditComponent } from './production-order-edit.component';

describe('ProductionOrderEditComponent', () => {
  let component: ProductionOrderEditComponent;
  let fixture: ComponentFixture<ProductionOrderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionOrderEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionOrderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
