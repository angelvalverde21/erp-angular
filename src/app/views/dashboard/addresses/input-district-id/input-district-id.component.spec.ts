import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDistrictIdComponent } from './input-district-id.component';

describe('InputDistrictIdComponent', () => {
  let component: InputDistrictIdComponent;
  let fixture: ComponentFixture<InputDistrictIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDistrictIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputDistrictIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
