import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeIndexComponent } from './barcode-index.component';

describe('BarcodeIndexComponent', () => {
  let component: BarcodeIndexComponent;
  let fixture: ComponentFixture<BarcodeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarcodeIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
