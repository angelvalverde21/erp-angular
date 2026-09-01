import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReadIndexComponent } from './payment-read-index.component';

describe('PaymentReadIndexComponent', () => {
  let component: PaymentReadIndexComponent;
  let fixture: ComponentFixture<PaymentReadIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentReadIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentReadIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
