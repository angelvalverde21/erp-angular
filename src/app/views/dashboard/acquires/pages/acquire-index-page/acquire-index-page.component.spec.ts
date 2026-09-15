import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireIndexPageComponent } from './acquire-index-page.component';

describe('AcquireIndexPageComponent', () => {
  let component: AcquireIndexPageComponent;
  let fixture: ComponentFixture<AcquireIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
