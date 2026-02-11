import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexCreateComponent } from './kardex-create.component';

describe('KardexCreateComponent', () => {
  let component: KardexCreateComponent;
  let fixture: ComponentFixture<KardexCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
