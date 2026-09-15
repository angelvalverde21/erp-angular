import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPrintComponent } from './button-print.component';

describe('ButtonPrintComponent', () => {
  let component: ButtonPrintComponent;
  let fixture: ComponentFixture<ButtonPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
