import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemRowComponent } from './inventory-item-row.component';

describe('InventoryItemRowComponent', () => {
  let component: InventoryItemRowComponent;
  let fixture: ComponentFixture<InventoryItemRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryItemRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
