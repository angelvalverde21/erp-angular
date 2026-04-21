import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSalaryIndexComponent } from './employee-salary-index.component';

describe('EmployeeSalaryIndexComponent', () => {
  let component: EmployeeSalaryIndexComponent;
  let fixture: ComponentFixture<EmployeeSalaryIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeSalaryIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeSalaryIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
