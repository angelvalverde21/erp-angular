import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductColorSizeTemplateComponent } from './product-color-size-template.component';

describe('ProductColorSizeTemplateComponent', () => {
  let component: ProductColorSizeTemplateComponent;
  let fixture: ComponentFixture<ProductColorSizeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductColorSizeTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductColorSizeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
