import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeAttendanceIndexComponent } from './employe-attendance-index.component';

describe('EmployeAttendanceIndexComponent', () => {
  let component: EmployeAttendanceIndexComponent;
  let fixture: ComponentFixture<EmployeAttendanceIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeAttendanceIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeAttendanceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
