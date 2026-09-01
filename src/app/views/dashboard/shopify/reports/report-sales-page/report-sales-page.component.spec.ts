import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSalesPageComponent } from './report-sales-page.component';

describe('ReportSalesPageComponent', () => {
  let component: ReportSalesPageComponent;
  let fixture: ComponentFixture<ReportSalesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSalesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSalesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
