import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselEditPageComponent } from './carousel-edit-page.component';

describe('CarouselEditPageComponent', () => {
  let component: CarouselEditPageComponent;
  let fixture: ComponentFixture<CarouselEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
