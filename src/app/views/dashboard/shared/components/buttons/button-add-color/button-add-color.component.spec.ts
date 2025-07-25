import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAddColorComponent } from './button-add-color.component';

describe('ButtonAddColorComponent', () => {
  let component: ButtonAddColorComponent;
  let fixture: ComponentFixture<ButtonAddColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonAddColorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonAddColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
