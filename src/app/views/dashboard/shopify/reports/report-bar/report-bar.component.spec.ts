import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBarComponent } from './report-bar.component';

describe('ReportBarComponent', () => {
  let component: ReportBarComponent;
  let fixture: ComponentFixture<ReportBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
