import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIndexPageComponent } from './product-index-page.component';

describe('ProductIndexPageComponent', () => {
  let component: ProductIndexPageComponent;
  let fixture: ComponentFixture<ProductIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
