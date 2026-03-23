import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitIndexPageComponent } from './unit-index-page.component';

describe('UnitIndexPageComponent', () => {
  let component: UnitIndexPageComponent;
  let fixture: ComponentFixture<UnitIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
