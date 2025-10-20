import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPurchaseCreateComponent } from './button-purchase-create.component';

describe('ButtonPurchaseCreateComponent', () => {
  let component: ButtonPurchaseCreateComponent;
  let fixture: ComponentFixture<ButtonPurchaseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPurchaseCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonPurchaseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
