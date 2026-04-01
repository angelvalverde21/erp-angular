import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionCreateComponent } from './manufacture-production-create.component';

describe('ManufactureProductionCreateComponent', () => {
  let component: ManufactureProductionCreateComponent;
  let fixture: ComponentFixture<ManufactureProductionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
