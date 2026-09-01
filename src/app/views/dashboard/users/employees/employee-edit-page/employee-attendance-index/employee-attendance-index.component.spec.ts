import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAttendanceIndexComponent } from './employee-attendance-index.component';

describe('EmployeeAttendanceIndexComponent', () => {
  let component: EmployeeAttendanceIndexComponent;
  let fixture: ComponentFixture<EmployeeAttendanceIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAttendanceIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeAttendanceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
