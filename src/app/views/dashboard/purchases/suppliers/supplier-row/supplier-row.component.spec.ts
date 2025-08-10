import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRowComponent } from './supplier-row.component';

describe('SupplierRowComponent', () => {
  let component: SupplierRowComponent;
  let fixture: ComponentFixture<SupplierRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
