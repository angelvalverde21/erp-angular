import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierIndexRowComponent } from './supplier-index-row.component';

describe('SupplierIndexRowComponent', () => {
  let component: SupplierIndexRowComponent;
  let fixture: ComponentFixture<SupplierIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
