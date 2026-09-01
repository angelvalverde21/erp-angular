import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionEditPageComponent } from './manufacture-production-edit-page.component';

describe('ManufactureProductionEditPageComponent', () => {
  let component: ManufactureProductionEditPageComponent;
  let fixture: ComponentFixture<ManufactureProductionEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
