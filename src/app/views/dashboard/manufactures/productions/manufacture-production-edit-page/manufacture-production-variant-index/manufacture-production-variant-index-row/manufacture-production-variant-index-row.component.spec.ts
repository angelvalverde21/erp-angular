import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureProductionVariantIndexRowComponent } from './manufacture-production-variant-index-row.component';

describe('ManufactureProductionVariantIndexRowComponent', () => {
  let component: ManufactureProductionVariantIndexRowComponent;
  let fixture: ComponentFixture<ManufactureProductionVariantIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureProductionVariantIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureProductionVariantIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
