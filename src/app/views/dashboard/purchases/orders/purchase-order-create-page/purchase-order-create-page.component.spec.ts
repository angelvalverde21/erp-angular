import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderCreatePageComponent } from './purchase-order-create-page.component';

describe('PurchaseOrderCreatePageComponent', () => {
  let component: PurchaseOrderCreatePageComponent;
  let fixture: ComponentFixture<PurchaseOrderCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
