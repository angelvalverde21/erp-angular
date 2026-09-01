import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarMonthPageComponent } from './bar-month-page.component';

describe('BarMonthPageComponent', () => {
  let component: BarMonthPageComponent;
  let fixture: ComponentFixture<BarMonthPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarMonthPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarMonthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
