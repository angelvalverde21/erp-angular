import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireKardexIndexPageComponent } from './acquire-kardex-index-page.component';

describe('AcquireKardexIndexPageComponent', () => {
  let component: AcquireKardexIndexPageComponent;
  let fixture: ComponentFixture<AcquireKardexIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireKardexIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireKardexIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
