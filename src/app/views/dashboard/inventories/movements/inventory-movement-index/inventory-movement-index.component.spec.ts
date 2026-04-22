import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementIndexComponent } from './inventory-movement-index.component';

describe('InventoryMovementIndexComponent', () => {
  let component: InventoryMovementIndexComponent;
  let fixture: ComponentFixture<InventoryMovementIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMovementIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMovementIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
