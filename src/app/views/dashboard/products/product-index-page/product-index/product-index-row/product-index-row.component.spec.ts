import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIndexRowComponent } from './product-index-row.component';

describe('ProductIndexRowComponent', () => {
  let component: ProductIndexRowComponent;
  let fixture: ComponentFixture<ProductIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
