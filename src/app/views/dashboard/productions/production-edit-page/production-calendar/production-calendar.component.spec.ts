import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCalendarComponent } from './production-calendar.component';

describe('ProductionCalendarComponent', () => {
  let component: ProductionCalendarComponent;
  let fixture: ComponentFixture<ProductionCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
