import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryItemIndexComponent } from './inventory-item-index.component';

describe('InventoryItemIndexComponent', () => {
  let component: InventoryItemIndexComponent;
  let fixture: ComponentFixture<InventoryItemIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryItemIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryItemIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
