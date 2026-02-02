import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureVariantIndexComponent } from './manufacture-variant-index.component';

describe('ManufactureVariantIndexComponent', () => {
  let component: ManufactureVariantIndexComponent;
  let fixture: ComponentFixture<ManufactureVariantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureVariantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureVariantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
