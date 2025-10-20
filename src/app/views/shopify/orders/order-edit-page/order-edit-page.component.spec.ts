import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderEditPageComponent } from './order-edit-page.component';

describe('OrderEditPageComponent', () => {
  let component: OrderEditPageComponent;
  let fixture: ComponentFixture<OrderEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
