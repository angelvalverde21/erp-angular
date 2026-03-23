import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHeadTableComponent } from './purchase-head-table.component';

describe('PurchaseHeadTableComponent', () => {
  let component: PurchaseHeadTableComponent;
  let fixture: ComponentFixture<PurchaseHeadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseHeadTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHeadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
