import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReceptionIndexComponent } from './production-reception-index.component';

describe('ProductionReceptionIndexComponent', () => {
  let component: ProductionReceptionIndexComponent;
  let fixture: ComponentFixture<ProductionReceptionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReceptionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionReceptionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
