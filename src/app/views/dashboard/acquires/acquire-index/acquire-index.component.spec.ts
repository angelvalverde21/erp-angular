import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireIndexComponent } from './acquire-index.component';

describe('AcquireIndexComponent', () => {
  let component: AcquireIndexComponent;
  let fixture: ComponentFixture<AcquireIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
