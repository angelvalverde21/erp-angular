import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionVariantIndexComponent } from './manufacture-production-variant-index.component';

describe('ManufactureProductionVariantIndexComponent', () => {
  let component: ManufactureProductionVariantIndexComponent;
  let fixture: ComponentFixture<ManufactureProductionVariantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionVariantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionVariantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
