import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderHeadTableComponent } from './purchase-order-head-table.component';

describe('PurchaseOrderHeadTableComponent', () => {
  let component: PurchaseOrderHeadTableComponent;
  let fixture: ComponentFixture<PurchaseOrderHeadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderHeadTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderHeadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
