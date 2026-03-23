import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayCreatePageComponent } from './gateway-create-page.component';

describe('GatewayCreatePageComponent', () => {
  let component: GatewayCreatePageComponent;
  let fixture: ComponentFixture<GatewayCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewayCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
