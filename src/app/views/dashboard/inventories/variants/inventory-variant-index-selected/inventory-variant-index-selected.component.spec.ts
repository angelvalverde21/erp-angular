import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryVariantIndexSelectedComponent } from './inventory-variant-index-selected.component';

describe('InventoryVariantIndexSelectedComponent', () => {
  let component: InventoryVariantIndexSelectedComponent;
  let fixture: ComponentFixture<InventoryVariantIndexSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryVariantIndexSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryVariantIndexSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



