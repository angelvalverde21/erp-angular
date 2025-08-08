import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselCreatePageComponent } from './carousel-create-page.component';

describe('CarouselCreatePageComponent', () => {
  let component: CarouselCreatePageComponent;
  let fixture: ComponentFixture<CarouselCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
