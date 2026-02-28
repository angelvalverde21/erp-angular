import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeIndexRowComponent } from './employe-index-row.component';

describe('EmployeIndexRowComponent', () => {
  let component: EmployeIndexRowComponent;
  let fixture: ComponentFixture<EmployeIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
