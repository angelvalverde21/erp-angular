import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpPagoLinkCreatePageComponent } from './mp-pago-link-create-page.component';

describe('MpPagoLinkCreatePageComponent', () => {
  let component: MpPagoLinkCreatePageComponent;
  let fixture: ComponentFixture<MpPagoLinkCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpPagoLinkCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpPagoLinkCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
