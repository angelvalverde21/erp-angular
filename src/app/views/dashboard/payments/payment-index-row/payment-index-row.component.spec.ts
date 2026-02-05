import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentIndexRowComponent } from './payment-index-row.component';

describe('PaymentIndexRowComponent', () => {
  let component: PaymentIndexRowComponent;
  let fixture: ComponentFixture<PaymentIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
