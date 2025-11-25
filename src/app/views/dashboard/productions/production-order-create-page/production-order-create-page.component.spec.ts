import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderCreatePageComponent } from './production-order-create-page.component';

describe('ProductionOrderCreatePageComponent', () => {
  let component: ProductionOrderCreatePageComponent;
  let fixture: ComponentFixture<ProductionOrderCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionOrderCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionOrderCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
