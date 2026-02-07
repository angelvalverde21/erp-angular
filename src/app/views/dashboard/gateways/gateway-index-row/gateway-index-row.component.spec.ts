import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIndexRowComponent } from './gateway-index-row.component';

describe('GatewayIndexRowComponent', () => {
  let component: GatewayIndexRowComponent;
  let fixture: ComponentFixture<GatewayIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewayIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
