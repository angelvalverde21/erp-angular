import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashIncomeWeeklyIndexComponent } from './cash-income-weekly-index.component';

describe('CashIncomeWeeklyIndexComponent', () => {
  let component: CashIncomeWeeklyIndexComponent;
  let fixture: ComponentFixture<CashIncomeWeeklyIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashIncomeWeeklyIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashIncomeWeeklyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
