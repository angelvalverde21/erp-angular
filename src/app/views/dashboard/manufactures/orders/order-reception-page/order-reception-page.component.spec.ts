import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReceptionPageComponent } from './order-reception-page.component';

describe('OrderReceptionPageComponent', () => {
  let component: OrderReceptionPageComponent;
  let fixture: ComponentFixture<OrderReceptionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderReceptionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderReceptionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
