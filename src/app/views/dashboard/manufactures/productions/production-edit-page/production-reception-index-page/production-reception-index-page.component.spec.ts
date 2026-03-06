import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReceptionIndexPageComponent } from './production-reception-index-page.component';

describe('ProductionReceptionIndexPageComponent', () => {
  let component: ProductionReceptionIndexPageComponent;
  let fixture: ComponentFixture<ProductionReceptionIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReceptionIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionReceptionIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
