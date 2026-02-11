import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageIndexRowComponent } from './image-index-row.component';

describe('ImageIndexRowComponent', () => {
  let component: ImageIndexRowComponent;
  let fixture: ComponentFixture<ImageIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
