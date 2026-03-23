import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderVariantIndexComponent } from './order-variant-index.component';

describe('OrderVariantIndexComponent', () => {
  let component: OrderVariantIndexComponent;
  let fixture: ComponentFixture<OrderVariantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderVariantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderVariantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
