import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpPagoLinkCreateComponent } from './mp-pago-link-create.component';

describe('MpPagoLinkCreateComponent', () => {
  let component: MpPagoLinkCreateComponent;
  let fixture: ComponentFixture<MpPagoLinkCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpPagoLinkCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpPagoLinkCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
