import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorIndexComponent } from './color-index.component';

describe('ColorIndexComponent', () => {
  let component: ColorIndexComponent;
  let fixture: ComponentFixture<ColorIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
