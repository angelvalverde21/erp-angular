import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderVariantRowComponent } from './order-variant-row.component';

describe('OrderVariantRowComponent', () => {
  let component: OrderVariantRowComponent;
  let fixture: ComponentFixture<OrderVariantRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderVariantRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderVariantRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
