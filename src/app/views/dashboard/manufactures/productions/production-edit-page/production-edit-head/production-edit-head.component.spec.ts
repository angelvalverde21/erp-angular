import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionEditHeadComponent } from './production-edit-head.component';

describe('ProductionEditHeadComponent', () => {
  let component: ProductionEditHeadComponent;
  let fixture: ComponentFixture<ProductionEditHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionEditHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionEditHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
