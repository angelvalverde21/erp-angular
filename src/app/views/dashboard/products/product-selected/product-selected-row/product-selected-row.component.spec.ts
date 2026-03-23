import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSelectedRowComponent } from './product-selected-row.component';

describe('ProductSelectedRowComponent', () => {
  let component: ProductSelectedRowComponent;
  let fixture: ComponentFixture<ProductSelectedRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSelectedRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSelectedRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
