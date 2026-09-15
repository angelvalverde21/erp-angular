import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleIndexComponent } from './employee-schedule-index.component';

describe('EmployeeScheduleIndexComponent', () => {
  let component: EmployeeScheduleIndexComponent;
  let fixture: ComponentFixture<EmployeeScheduleIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeScheduleIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeScheduleIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
