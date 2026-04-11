import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryIncomeIndexPageComponent } from './inventory-income-index-page.component';

describe('InventoryIncomeIndexPageComponent', () => {
  let component: InventoryIncomeIndexPageComponent;
  let fixture: ComponentFixture<InventoryIncomeIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryIncomeIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryIncomeIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
