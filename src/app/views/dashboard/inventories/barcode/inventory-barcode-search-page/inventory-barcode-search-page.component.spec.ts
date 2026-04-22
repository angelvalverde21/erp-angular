import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBarcodeSearchPageComponent } from './inventory-barcode-search-page.component';

describe('InventoryBarcodeSearchPageComponent', () => {
  let component: InventoryBarcodeSearchPageComponent;
  let fixture: ComponentFixture<InventoryBarcodeSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBarcodeSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBarcodeSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
