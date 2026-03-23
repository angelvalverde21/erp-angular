import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureVariantRowComponent } from './manufacture-variant-row.component';

describe('ManufactureVariantRowComponent', () => {
  let component: ManufactureVariantRowComponent;
  let fixture: ComponentFixture<ManufactureVariantRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureVariantRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureVariantRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
