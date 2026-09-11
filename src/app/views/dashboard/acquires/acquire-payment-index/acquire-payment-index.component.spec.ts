import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquirePaymentIndexComponent } from './acquire-payment-index.component';

describe('AcquirePaymentIndexComponent', () => {
  let component: AcquirePaymentIndexComponent;
  let fixture: ComponentFixture<AcquirePaymentIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquirePaymentIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquirePaymentIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
