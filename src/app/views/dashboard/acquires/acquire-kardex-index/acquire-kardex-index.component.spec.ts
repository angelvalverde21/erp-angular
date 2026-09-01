import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireKardexIndexComponent } from './acquire-kardex-index.component';

describe('AcquireKardexIndexComponent', () => {
  let component: AcquireKardexIndexComponent;
  let fixture: ComponentFixture<AcquireKardexIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireKardexIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireKardexIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
