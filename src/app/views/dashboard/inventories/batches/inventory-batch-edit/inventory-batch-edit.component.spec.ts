import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBatchEditComponent } from './inventory-batch-edit.component';

describe('InventoryBatchEditComponent', () => {
  let component: InventoryBatchEditComponent;
  let fixture: ComponentFixture<InventoryBatchEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBatchEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBatchEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
