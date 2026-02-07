import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayIndexPageComponent } from './gateway-index-page.component';

describe('GatewayIndexPageComponent', () => {
  let component: GatewayIndexPageComponent;
  let fixture: ComponentFixture<GatewayIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewayIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
