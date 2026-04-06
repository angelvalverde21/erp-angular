import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBarcodeCreatePageComponent } from './inventory-barcode-create-page.component';

describe('InventoryBarcodeCreatePageComponent', () => {
  let component: InventoryBarcodeCreatePageComponent;
  let fixture: ComponentFixture<InventoryBarcodeCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBarcodeCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBarcodeCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
