import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryVariantIndexComponent } from './inventory-variant-index.component';

describe('InventoryVariantIndexComponent', () => {
  let component: InventoryVariantIndexComponent;
  let fixture: ComponentFixture<InventoryVariantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryVariantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryVariantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



