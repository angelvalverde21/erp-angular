import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionEditPageComponent } from './production-edit-page.component';

describe('ProductionEditPageComponent', () => {
  let component: ProductionEditPageComponent;
  let fixture: ComponentFixture<ProductionEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
