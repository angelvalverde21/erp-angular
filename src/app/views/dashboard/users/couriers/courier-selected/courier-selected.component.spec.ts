import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierSelectedComponent } from './courier-selected.component';

describe('CourierSelectedComponent', () => {
  let component: CourierSelectedComponent;
  let fixture: ComponentFixture<CourierSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
