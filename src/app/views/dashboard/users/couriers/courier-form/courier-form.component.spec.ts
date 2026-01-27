import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierFormComponent } from './courier-form.component';

describe('CourierFormComponent', () => {
  let component: CourierFormComponent;
  let fixture: ComponentFixture<CourierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
