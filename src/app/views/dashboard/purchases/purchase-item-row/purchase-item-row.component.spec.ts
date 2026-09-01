import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseItemRowComponent } from './purchase-item-row.component';

describe('PurchaseItemRowComponent', () => {
  let component: PurchaseItemRowComponent;
  let fixture: ComponentFixture<PurchaseItemRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseItemRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseItemRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
