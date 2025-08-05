import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSizeComponent } from './color-size.component';

describe('ColorSizeComponent', () => {
  let component: ColorSizeComponent;
  let fixture: ComponentFixture<ColorSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
