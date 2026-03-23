import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayEditPageComponent } from './gateway-edit-page.component';

describe('GatewayEditPageComponent', () => {
  let component: GatewayEditPageComponent;
  let fixture: ComponentFixture<GatewayEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatewayEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewayEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
