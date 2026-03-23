import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceIndexPageComponent } from './attendance-index-page.component';

describe('AttendanceIndexPageComponent', () => {
  let component: AttendanceIndexPageComponent;
  let fixture: ComponentFixture<AttendanceIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
