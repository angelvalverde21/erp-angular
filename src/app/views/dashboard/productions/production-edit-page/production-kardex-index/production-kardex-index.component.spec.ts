import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionKardexIndexComponent } from './production-kardex-index.component';

describe('ProductionKardexIndexComponent', () => {
  let component: ProductionKardexIndexComponent;
  let fixture: ComponentFixture<ProductionKardexIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionKardexIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionKardexIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
