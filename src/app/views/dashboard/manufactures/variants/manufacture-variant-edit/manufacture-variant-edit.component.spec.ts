import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureVariantEditComponent } from './manufacture-variant-edit.component';

describe('ManufactureVariantEditComponent', () => {
  let component: ManufactureVariantEditComponent;
  let fixture: ComponentFixture<ManufactureVariantEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureVariantEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureVariantEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
