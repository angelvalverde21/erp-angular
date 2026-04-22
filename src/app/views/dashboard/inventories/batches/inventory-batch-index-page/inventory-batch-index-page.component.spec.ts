import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryBatchIndexPageComponent } from './inventory-batch-index-page.component';

describe('InventoryBatchIndexPageComponent', () => {
  let component: InventoryBatchIndexPageComponent;
  let fixture: ComponentFixture<InventoryBatchIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBatchIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryBatchIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
