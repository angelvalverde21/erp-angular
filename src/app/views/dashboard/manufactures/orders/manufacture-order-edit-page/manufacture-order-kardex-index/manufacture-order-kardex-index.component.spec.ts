import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureOrderKardexIndexComponent } from './manufacture-order-kardex-index.component';

describe('ManufactureOrderKardexIndexComponent', () => {
  let component: ManufactureOrderKardexIndexComponent;
  let fixture: ComponentFixture<ManufactureOrderKardexIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManufactureOrderKardexIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufactureOrderKardexIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
