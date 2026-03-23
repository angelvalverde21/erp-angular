import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitEditPageComponent } from './unit-edit-page.component';

describe('UnitEditPageComponent', () => {
  let component: UnitEditPageComponent;
  let fixture: ComponentFixture<UnitEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
