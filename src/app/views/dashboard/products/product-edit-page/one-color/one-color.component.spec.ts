import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneColorComponent } from './one-color.component';

describe('OneColorComponent', () => {
  let component: OneColorComponent;
  let fixture: ComponentFixture<OneColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneColorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
