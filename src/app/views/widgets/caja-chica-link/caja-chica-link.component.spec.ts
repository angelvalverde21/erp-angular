import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaChicaLinkComponent } from './caja-chica-link.component';

describe('CajaChicaLinkComponent', () => {
  let component: CajaChicaLinkComponent;
  let fixture: ComponentFixture<CajaChicaLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajaChicaLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajaChicaLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
