import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionEditComponent } from './manufacture-production-edit.component';

describe('ManufactureProductionEditComponent', () => {
  let component: ManufactureProductionEditComponent;
  let fixture: ComponentFixture<ManufactureProductionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
