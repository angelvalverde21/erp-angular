import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionSummaryPageComponent } from './production-summary-page.component';

describe('ProductionSummaryPageComponent', () => {
  let component: ProductionSummaryPageComponent;
  let fixture: ComponentFixture<ProductionSummaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionSummaryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
