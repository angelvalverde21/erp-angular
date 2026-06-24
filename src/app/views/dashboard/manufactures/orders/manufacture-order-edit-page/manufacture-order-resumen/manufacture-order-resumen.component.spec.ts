import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderResumenComponent } from './manufacture-order-resumen.component';

describe('ManufactureOrderResumenComponent', () => {
  let component: ManufactureOrderResumenComponent;
  let fixture: ComponentFixture<ManufactureOrderResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
