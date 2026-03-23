import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseItemIndexComponent } from './purchase-item-index.component';

describe('PurchaseItemIndexComponent', () => {
  let component: PurchaseItemIndexComponent;
  let fixture: ComponentFixture<PurchaseItemIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseItemIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseItemIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
