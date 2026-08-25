import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireVariantIndexRowComponent } from './acquire-variant-index-row.component';

describe('AcquireVariantIndexRowComponent', () => {
  let component: AcquireVariantIndexRowComponent;
  let fixture: ComponentFixture<AcquireVariantIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireVariantIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireVariantIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
