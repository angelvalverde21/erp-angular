import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryIndexRowComponent } from './inventory-index-row.component';

describe('InventoryIndexRowComponent', () => {
  let component: InventoryIndexRowComponent;
  let fixture: ComponentFixture<InventoryIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
