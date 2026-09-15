import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionSearchPageComponent } from './production-search-page.component';

describe('ProductionSearchPageComponent', () => {
  let component: ProductionSearchPageComponent;
  let fixture: ComponentFixture<ProductionSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
