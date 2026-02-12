import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexRegisterInComponent } from './kardex-register-in.component';

describe('KardexRegisterInComponent', () => {
  let component: KardexRegisterInComponent;
  let fixture: ComponentFixture<KardexRegisterInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexRegisterInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexRegisterInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
