import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeIndexPageComponent } from './employee-index-page.component';

describe('EmployeeIndexPageComponent', () => {
  let component: EmployeeIndexPageComponent;
  let fixture: ComponentFixture<EmployeeIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
