import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexRegisterReInComponent } from './kardex-register-re-in.component';

describe('KardexRegisterReInComponent', () => {
  let component: KardexRegisterReInComponent;
  let fixture: ComponentFixture<KardexRegisterReInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexRegisterReInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexRegisterReInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
