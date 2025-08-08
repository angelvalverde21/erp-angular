import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselIndexPageComponent } from './carousel-index-page.component';

describe('CarouselIndexPageComponent', () => {
  let component: CarouselIndexPageComponent;
  let fixture: ComponentFixture<CarouselIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
