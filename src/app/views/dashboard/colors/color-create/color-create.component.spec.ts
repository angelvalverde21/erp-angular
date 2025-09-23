import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorCreateComponent } from './color-create.component';

describe('ColorCreateComponent', () => {
  let component: ColorCreateComponent;
  let fixture: ComponentFixture<ColorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
