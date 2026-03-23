import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitIndexComponent } from './unit-index.component';

describe('UnitIndexComponent', () => {
  let component: UnitIndexComponent;
  let fixture: ComponentFixture<UnitIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
