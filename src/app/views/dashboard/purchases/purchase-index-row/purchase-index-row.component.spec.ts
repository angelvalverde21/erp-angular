import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseIndexRowComponent } from './purchase-index-row.component';

describe('PurchaseIndexRowComponent', () => {
  let component: PurchaseIndexRowComponent;
  let fixture: ComponentFixture<PurchaseIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
