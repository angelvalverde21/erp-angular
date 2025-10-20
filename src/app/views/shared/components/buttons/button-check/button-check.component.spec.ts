import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonCheckComponent } from './button-check.component';

describe('ButtonCheckComponent', () => {
  let component: ButtonCheckComponent;
  let fixture: ComponentFixture<ButtonCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
