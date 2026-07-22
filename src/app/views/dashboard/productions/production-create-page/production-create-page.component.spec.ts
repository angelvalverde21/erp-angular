import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionCreatePageComponent } from './production-create-page.component';

describe('ProductionCreatePageComponent', () => {
  let component: ProductionCreatePageComponent;
  let fixture: ComponentFixture<ProductionCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
