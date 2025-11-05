import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDailyPageComponent } from './report-daily-page.component';

describe('ReportDailyPageComponent', () => {
  let component: ReportDailyPageComponent;
  let fixture: ComponentFixture<ReportDailyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDailyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDailyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
