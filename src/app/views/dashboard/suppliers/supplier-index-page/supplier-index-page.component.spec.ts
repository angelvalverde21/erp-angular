import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierIndexPageComponent } from './supplier-index-page.component';

describe('SupplierIndexPageComponent', () => {
  let component: SupplierIndexPageComponent;
  let fixture: ComponentFixture<SupplierIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
