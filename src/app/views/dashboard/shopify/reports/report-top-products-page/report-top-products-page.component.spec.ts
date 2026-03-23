import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTopProductsPageComponent } from './report-top-products-page.component';

describe('ReportTopProductsPageComponent', () => {
  let component: ReportTopProductsPageComponent;
  let fixture: ComponentFixture<ReportTopProductsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportTopProductsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportTopProductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
