import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageIndexComponent } from './image-index.component';

describe('ImageIndexComponent', () => {
  let component: ImageIndexComponent;
  let fixture: ComponentFixture<ImageIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
