import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarDailyPageComponent } from './bar-daily-page.component';

describe('BarDailyPageComponent', () => {
  let component: BarDailyPageComponent;
  let fixture: ComponentFixture<BarDailyPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarDailyPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarDailyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
