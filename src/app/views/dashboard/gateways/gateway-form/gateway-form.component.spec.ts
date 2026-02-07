import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayFormComponent } from './gateway-form.component';

describe('GatewayFormComponent', () => {
  let component: GatewayFormComponent;
  let fixture: ComponentFixture<GatewayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
