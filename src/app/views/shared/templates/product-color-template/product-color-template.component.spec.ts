import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductColorTemplateComponent } from './product-color-template.component';

describe('ProductColorTemplateComponent', () => {
  let component: ProductColorTemplateComponent;
  let fixture: ComponentFixture<ProductColorTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductColorTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductColorTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
