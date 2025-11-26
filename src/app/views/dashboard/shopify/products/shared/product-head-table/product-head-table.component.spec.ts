import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductHeadTableComponent } from './product-head-table.component';

describe('ProductHeadTableComponent', () => {
  let component: ProductHeadTableComponent;
  let fixture: ComponentFixture<ProductHeadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductHeadTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductHeadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
