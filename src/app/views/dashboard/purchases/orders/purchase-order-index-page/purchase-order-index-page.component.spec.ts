import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderIndexPageComponent } from './purchase-order-index-page.component';

describe('PurchaseOrderIndexPageComponent', () => {
  let component: PurchaseOrderIndexPageComponent;
  let fixture: ComponentFixture<PurchaseOrderIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseOrderIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
