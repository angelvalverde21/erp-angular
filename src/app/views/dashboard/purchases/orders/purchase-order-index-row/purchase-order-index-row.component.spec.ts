import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderIndexRowComponent } from './purchase-order-index-row.component';

describe('PurchaseOrderIndexRowComponent', () => {
  let component: PurchaseOrderIndexRowComponent;
  let fixture: ComponentFixture<PurchaseOrderIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
