import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBarcodePageComponent } from './inventory-barcode-page.component';

describe('InventoryBarcodePageComponent', () => {
  let component: InventoryBarcodePageComponent;
  let fixture: ComponentFixture<InventoryBarcodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBarcodePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBarcodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
