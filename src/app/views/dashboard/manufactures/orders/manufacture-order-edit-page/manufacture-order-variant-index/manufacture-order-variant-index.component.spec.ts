import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderVariantIndexComponent } from './manufacture-order-variant-index.component';

describe('ManufactureOrderVariantIndexComponent', () => {
  let component: ManufactureOrderVariantIndexComponent;
  let fixture: ComponentFixture<ManufactureOrderVariantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderVariantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderVariantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
