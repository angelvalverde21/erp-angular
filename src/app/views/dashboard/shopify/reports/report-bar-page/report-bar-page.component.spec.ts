import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBarPageComponent } from './report-bar-page.component';

describe('ReportBarPageComponent', () => {
  let component: ReportBarPageComponent;
  let fixture: ComponentFixture<ReportBarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportBarPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportBarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
