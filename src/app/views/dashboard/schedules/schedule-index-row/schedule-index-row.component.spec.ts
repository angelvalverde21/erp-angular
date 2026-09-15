import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleIndexRowComponent } from './schedule-index-row.component';

describe('ScheduleIndexRowComponent', () => {
  let component: ScheduleIndexRowComponent;
  let fixture: ComponentFixture<ScheduleIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
