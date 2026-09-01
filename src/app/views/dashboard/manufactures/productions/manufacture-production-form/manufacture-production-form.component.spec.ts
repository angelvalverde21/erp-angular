import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionFormComponent } from './manufacture-production-form.component';

describe('ManufactureProductionFormComponent', () => {
  let component: ManufactureProductionFormComponent;
  let fixture: ComponentFixture<ManufactureProductionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
