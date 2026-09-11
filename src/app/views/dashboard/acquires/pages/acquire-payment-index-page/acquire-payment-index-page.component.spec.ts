import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquirePaymentIndexPageComponent } from './acquire-payment-index-page.component';

describe('AcquirePaymentIndexPageComponent', () => {
  let component: AcquirePaymentIndexPageComponent;
  let fixture: ComponentFixture<AcquirePaymentIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquirePaymentIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquirePaymentIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
