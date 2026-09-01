import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionSearchComponent } from './production-search.component';

describe('ProductionSearchComponent', () => {
  let component: ProductionSearchComponent;
  let fixture: ComponentFixture<ProductionSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
