import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTopProductsBetweenPageComponent } from './report-top-products-between-page.component';

describe('ReportTopProductsBetweenPageComponent', () => {
  let component: ReportTopProductsBetweenPageComponent;
  let fixture: ComponentFixture<ReportTopProductsBetweenPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTopProductsBetweenPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTopProductsBetweenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
