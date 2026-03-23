import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCreatePageComponent } from './unit-create-page.component';

describe('UnitCreatePageComponent', () => {
  let component: UnitCreatePageComponent;
  let fixture: ComponentFixture<UnitCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
