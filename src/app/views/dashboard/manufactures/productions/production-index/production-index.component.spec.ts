import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionIndexComponent } from './production-index.component';

describe('ProductionIndexComponent', () => {
  let component: ProductionIndexComponent;
  let fixture: ComponentFixture<ProductionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
