import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPrintBarcodeComponent } from './button-print-barcode.component';

describe('ButtonPrintBarcodeComponent', () => {
  let component: ButtonPrintBarcodeComponent;
  let fixture: ComponentFixture<ButtonPrintBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonPrintBarcodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonPrintBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
