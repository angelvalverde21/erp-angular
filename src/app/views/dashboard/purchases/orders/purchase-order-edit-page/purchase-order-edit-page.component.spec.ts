import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderEditPageComponent } from './purchase-order-edit-page.component';

describe('PurchaseOrderEditPageComponent', () => {
  let component: PurchaseOrderEditPageComponent;
  let fixture: ComponentFixture<PurchaseOrderEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
