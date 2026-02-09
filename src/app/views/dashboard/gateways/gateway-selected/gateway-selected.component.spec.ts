import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewaySelectedComponent } from './gateway-selected.component';

describe('GatewaySelectedComponent', () => {
  let component: GatewaySelectedComponent;
  let fixture: ComponentFixture<GatewaySelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewaySelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewaySelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
