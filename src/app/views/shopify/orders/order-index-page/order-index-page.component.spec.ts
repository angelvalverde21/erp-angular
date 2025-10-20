import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderIndexPageComponent } from './order-index-page.component';

describe('OrderIndexPageComponent', () => {
  let component: OrderIndexPageComponent;
  let fixture: ComponentFixture<OrderIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
