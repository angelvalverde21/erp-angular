import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderLinkComponent } from './purchase-order-link.component';

describe('PurchaseOrderLinkComponent', () => {
  let component: PurchaseOrderLinkComponent;
  let fixture: ComponentFixture<PurchaseOrderLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
