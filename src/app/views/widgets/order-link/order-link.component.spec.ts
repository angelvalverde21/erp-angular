import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLinkComponent } from './order-link.component';

describe('OrderLinkComponent', () => {
  let component: OrderLinkComponent;
  let fixture: ComponentFixture<OrderLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
