import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitSelectedComponent } from './unit-selected.component';

describe('UnitSelectedComponent', () => {
  let component: UnitSelectedComponent;
  let fixture: ComponentFixture<UnitSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
