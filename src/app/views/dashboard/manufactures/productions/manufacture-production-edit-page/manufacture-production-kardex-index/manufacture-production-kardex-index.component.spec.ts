import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionKardexIndexComponent } from './manufacture-production-kardex-index.component';

describe('ManufactureProductionKardexIndexComponent', () => {
  let component: ManufactureProductionKardexIndexComponent;
  let fixture: ComponentFixture<ManufactureProductionKardexIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionKardexIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionKardexIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
