import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireVariantIndexComponent } from './acquire-variant-index.component';

describe('AcquireVariantIndexComponent', () => {
  let component: AcquireVariantIndexComponent;
  let fixture: ComponentFixture<AcquireVariantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireVariantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireVariantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
