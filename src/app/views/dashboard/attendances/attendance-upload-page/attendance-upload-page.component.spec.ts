import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceUploadPageComponent } from './attendance-upload-page.component';

describe('AttendanceUploadPageComponent', () => {
  let component: AttendanceUploadPageComponent;
  let fixture: ComponentFixture<AttendanceUploadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceUploadPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
