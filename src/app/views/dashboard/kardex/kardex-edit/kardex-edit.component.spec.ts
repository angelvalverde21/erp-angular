import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexEditComponent } from './kardex-edit.component';

describe('KardexEditComponent', () => {
  let component: KardexEditComponent;
  let fixture: ComponentFixture<KardexEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
