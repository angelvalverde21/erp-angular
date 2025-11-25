import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderEditPageComponent } from './production-order-edit-page.component';

describe('ProductionOrderEditPageComponent', () => {
  let component: ProductionOrderEditPageComponent;
  let fixture: ComponentFixture<ProductionOrderEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionOrderEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionOrderEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
