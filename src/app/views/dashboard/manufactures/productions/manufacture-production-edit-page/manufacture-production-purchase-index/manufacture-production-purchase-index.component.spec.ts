import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionPurchaseIndexComponent } from './manufacture-production-purchase-index.component';

describe('ManufactureProductionPurchaseIndexComponent', () => {
  let component: ManufactureProductionPurchaseIndexComponent;
  let fixture: ComponentFixture<ManufactureProductionPurchaseIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionPurchaseIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionPurchaseIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
