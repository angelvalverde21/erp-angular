import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployePaymentIndexComponent } from './employe-payment-index.component';

describe('EmployePaymentIndexComponent', () => {
  let component: EmployePaymentIndexComponent;
  let fixture: ComponentFixture<EmployePaymentIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployePaymentIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployePaymentIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
