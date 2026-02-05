import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentIndexComponent } from './payment-index.component';

describe('PaymentIndexComponent', () => {
  let component: PaymentIndexComponent;
  let fixture: ComponentFixture<PaymentIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
