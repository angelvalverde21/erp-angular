import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderIndexComponent } from './purchase-order-index.component';

describe('PurchaseOrderIndexComponent', () => {
  let component: PurchaseOrderIndexComponent;
  let fixture: ComponentFixture<PurchaseOrderIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
