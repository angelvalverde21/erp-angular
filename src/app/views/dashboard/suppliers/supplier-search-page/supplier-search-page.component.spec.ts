import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSearchPageComponent } from './supplier-search-page.component';

describe('SupplierSearchPageComponent', () => {
  let component: SupplierSearchPageComponent;
  let fixture: ComponentFixture<SupplierSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
