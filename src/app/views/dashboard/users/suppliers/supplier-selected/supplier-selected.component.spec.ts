import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSelectedComponent } from './supplier-selected.component';

describe('SupplierSelectedComponent', () => {
  let component: SupplierSelectedComponent;
  let fixture: ComponentFixture<SupplierSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
