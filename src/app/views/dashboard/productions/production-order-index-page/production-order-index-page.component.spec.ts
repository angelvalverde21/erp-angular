import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionOrderIndexPageComponent } from './production-order-index-page.component';

describe('ProductionOrderIndexPageComponent', () => {
  let component: ProductionOrderIndexPageComponent;
  let fixture: ComponentFixture<ProductionOrderIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionOrderIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionOrderIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
