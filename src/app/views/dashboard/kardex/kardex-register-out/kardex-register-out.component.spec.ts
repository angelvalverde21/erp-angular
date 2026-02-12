import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexRegisterOutComponent } from './kardex-register-out.component';

describe('KardexRegisterOutComponent', () => {
  let component: KardexRegisterOutComponent;
  let fixture: ComponentFixture<KardexRegisterOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexRegisterOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexRegisterOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
