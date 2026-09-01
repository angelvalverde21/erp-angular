import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryEditPageComponent } from './inventory-edit-page.component';

describe('InventoryEditPageComponent', () => {
  let component: InventoryEditPageComponent;
  let fixture: ComponentFixture<InventoryEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
