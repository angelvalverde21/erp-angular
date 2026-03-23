import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceIndexRowComponent } from './attendance-index-row.component';

describe('AttendanceIndexRowComponent', () => {
  let component: AttendanceIndexRowComponent;
  let fixture: ComponentFixture<AttendanceIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
