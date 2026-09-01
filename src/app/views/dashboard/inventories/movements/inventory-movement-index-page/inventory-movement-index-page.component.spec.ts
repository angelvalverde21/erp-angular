import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMovementIndexPageComponent } from './inventory-movement-index-page.component';

describe('InventoryMovementIndexPageComponent', () => {
  let component: InventoryMovementIndexPageComponent;
  let fixture: ComponentFixture<InventoryMovementIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMovementIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMovementIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
