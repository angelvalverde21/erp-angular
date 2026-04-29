import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderPaymentIndexComponent } from './manufacture-order-payment-index.component';

describe('ManufactureOrderPaymentIndexComponent', () => {
  let component: ManufactureOrderPaymentIndexComponent;
  let fixture: ComponentFixture<ManufactureOrderPaymentIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderPaymentIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderPaymentIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
