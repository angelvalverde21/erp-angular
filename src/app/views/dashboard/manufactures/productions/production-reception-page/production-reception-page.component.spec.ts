import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReceptionPageComponent } from './production-reception-page.component';

describe('ProductionReceptionPageComponent', () => {
  let component: ProductionReceptionPageComponent;
  let fixture: ComponentFixture<ProductionReceptionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReceptionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionReceptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
