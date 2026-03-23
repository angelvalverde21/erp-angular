import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionIndexRowComponent } from './production-index-row.component';

describe('ProductionIndexRowComponent', () => {
  let component: ProductionIndexRowComponent;
  let fixture: ComponentFixture<ProductionIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
