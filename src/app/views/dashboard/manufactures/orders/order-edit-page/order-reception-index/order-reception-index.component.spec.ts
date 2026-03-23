import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReceptionIndexComponent } from './order-reception-index.component';

describe('OrderReceptionIndexComponent', () => {
  let component: OrderReceptionIndexComponent;
  let fixture: ComponentFixture<OrderReceptionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderReceptionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderReceptionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
