import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireEditPageComponent } from './acquire-edit-page.component';

describe('AcquireEditPageComponent', () => {
  let component: AcquireEditPageComponent;
  let fixture: ComponentFixture<AcquireEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
