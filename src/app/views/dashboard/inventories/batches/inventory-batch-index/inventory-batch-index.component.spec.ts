import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBatchIndexComponent } from './inventory-batch-index.component';

describe('InventoryBatchIndexComponent', () => {
  let component: InventoryBatchIndexComponent;
  let fixture: ComponentFixture<InventoryBatchIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBatchIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBatchIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
