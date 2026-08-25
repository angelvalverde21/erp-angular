import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireCreatePageComponent } from './acquire-create-page.component';

describe('AcquireCreatePageComponent', () => {
  let component: AcquireCreatePageComponent;
  let fixture: ComponentFixture<AcquireCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
