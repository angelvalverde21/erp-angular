import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIndexRowComponent } from './order-index-row.component';

describe('OrderIndexRowComponent', () => {
  let component: OrderIndexRowComponent;
  let fixture: ComponentFixture<OrderIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
