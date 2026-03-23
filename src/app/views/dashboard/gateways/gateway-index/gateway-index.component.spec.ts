import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIndexComponent } from './gateway-index.component';

describe('GatewayIndexComponent', () => {
  let component: GatewayIndexComponent;
  let fixture: ComponentFixture<GatewayIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewayIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
