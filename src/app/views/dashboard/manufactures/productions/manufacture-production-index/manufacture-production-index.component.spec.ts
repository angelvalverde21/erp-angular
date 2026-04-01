import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionIndexComponent } from './manufacture-production-index.component';

describe('ManufactureProductionIndexComponent', () => {
  let component: ManufactureProductionIndexComponent;
  let fixture: ComponentFixture<ManufactureProductionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
