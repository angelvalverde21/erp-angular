import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierIndexComponent } from './courier-index.component';

describe('CourierIndexComponent', () => {
  let component: CourierIndexComponent;
  let fixture: ComponentFixture<CourierIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
