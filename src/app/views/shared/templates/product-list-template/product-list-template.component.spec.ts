import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListTemplateComponent } from './product-list-template.component';

describe('ProductListTemplateComponent', () => {
  let component: ProductListTemplateComponent;
  let fixture: ComponentFixture<ProductListTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
