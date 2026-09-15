import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireResumenComponent } from './acquire-resumen.component';

describe('AcquireResumenComponent', () => {
  let component: AcquireResumenComponent;
  let fixture: ComponentFixture<AcquireResumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireResumenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireResumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
