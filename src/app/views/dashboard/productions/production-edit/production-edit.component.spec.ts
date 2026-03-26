import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionEditComponent } from './production-edit.component';

describe('ProductionEditComponent', () => {
  let component: ProductionEditComponent;
  let fixture: ComponentFixture<ProductionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
