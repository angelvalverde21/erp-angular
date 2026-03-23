import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionIndexPageComponent } from './production-index-page.component';

describe('ProductionIndexPageComponent', () => {
  let component: ProductionIndexPageComponent;
  let fixture: ComponentFixture<ProductionIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
