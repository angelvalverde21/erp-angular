import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireVariantIndexPageComponent } from './acquire-variant-index-page.component';

describe('AcquireVariantIndexPageComponent', () => {
  let component: AcquireVariantIndexPageComponent;
  let fixture: ComponentFixture<AcquireVariantIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireVariantIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireVariantIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
