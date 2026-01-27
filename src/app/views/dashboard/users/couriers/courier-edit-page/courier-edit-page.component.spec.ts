import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierEditPageComponent } from './courier-edit-page.component';

describe('CourierEditPageComponent', () => {
  let component: CourierEditPageComponent;
  let fixture: ComponentFixture<CourierEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
