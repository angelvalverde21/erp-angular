import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryVariantSearchComponent } from './inventory-variant-search.component';

describe('InventoryVariantSearchComponent', () => {
  let component: InventoryVariantSearchComponent;
  let fixture: ComponentFixture<InventoryVariantSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryVariantSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryVariantSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



