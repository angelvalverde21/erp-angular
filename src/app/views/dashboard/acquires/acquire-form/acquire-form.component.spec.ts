import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireFormComponent } from './acquire-form.component';

describe('AcquireFormComponent', () => {
  let component: AcquireFormComponent;
  let fixture: ComponentFixture<AcquireFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
