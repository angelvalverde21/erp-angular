import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryIncomeIndexComponent } from './inventory-income-index.component';

describe('InventoryIncomeIndexComponent', () => {
  let component: InventoryIncomeIndexComponent;
  let fixture: ComponentFixture<InventoryIncomeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryIncomeIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryIncomeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
