import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierIndexPageComponent } from './courier-index-page.component';

describe('CourierIndexPageComponent', () => {
  let component: CourierIndexPageComponent;
  let fixture: ComponentFixture<CourierIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourierIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
