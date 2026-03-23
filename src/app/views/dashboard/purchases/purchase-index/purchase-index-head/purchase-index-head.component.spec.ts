import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseIndexHeadComponent } from './purchase-index-head.component';

describe('PurchaseIndexHeadComponent', () => {
  let component: PurchaseIndexHeadComponent;
  let fixture: ComponentFixture<PurchaseIndexHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseIndexHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseIndexHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
