import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionCalendarComponent } from './manufacture-production-calendar.component';

describe('ManufactureProductionCalendarComponent', () => {
  let component: ManufactureProductionCalendarComponent;
  let fixture: ComponentFixture<ManufactureProductionCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
