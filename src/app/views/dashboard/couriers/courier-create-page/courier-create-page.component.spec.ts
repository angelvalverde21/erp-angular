import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierCreatePageComponent } from './courier-create-page.component';

describe('CourierCreatePageComponent', () => {
  let component: CourierCreatePageComponent;
  let fixture: ComponentFixture<CourierCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
