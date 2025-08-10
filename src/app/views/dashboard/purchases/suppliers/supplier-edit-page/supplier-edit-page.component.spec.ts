import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierEditPageComponent } from './supplier-edit-page.component';

describe('SupplierEditPageComponent', () => {
  let component: SupplierEditPageComponent;
  let fixture: ComponentFixture<SupplierEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
