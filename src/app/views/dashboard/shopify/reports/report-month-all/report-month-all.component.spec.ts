import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMonthAllComponent } from './report-month-all.component';

describe('ReportMonthAllComponent', () => {
  let component: ReportMonthAllComponent;
  let fixture: ComponentFixture<ReportMonthAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportMonthAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportMonthAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
