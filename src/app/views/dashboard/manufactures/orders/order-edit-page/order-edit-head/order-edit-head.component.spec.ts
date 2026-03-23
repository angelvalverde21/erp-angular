import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditHeadComponent } from './order-edit-head.component';

describe('OrderEditHeadComponent', () => {
  let component: OrderEditHeadComponent;
  let fixture: ComponentFixture<OrderEditHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderEditHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEditHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
