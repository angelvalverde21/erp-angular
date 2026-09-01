import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBarcodeSearchComponent } from './inventory-barcode-search.component';

describe('InventoryBarcodeSearchComponent', () => {
  let component: InventoryBarcodeSearchComponent;
  let fixture: ComponentFixture<InventoryBarcodeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBarcodeSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBarcodeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
