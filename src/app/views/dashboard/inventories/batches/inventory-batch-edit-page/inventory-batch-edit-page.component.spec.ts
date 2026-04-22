import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBatchEditPageComponent } from './inventory-batch-edit-page.component';

describe('InventoryBatchEditPageComponent', () => {
  let component: InventoryBatchEditPageComponent;
  let fixture: ComponentFixture<InventoryBatchEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBatchEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBatchEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
