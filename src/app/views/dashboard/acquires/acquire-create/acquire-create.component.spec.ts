import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquireCreateComponent } from './acquire-create.component';

describe('AcquireCreateComponent', () => {
  let component: AcquireCreateComponent;
  let fixture: ComponentFixture<AcquireCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcquireCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcquireCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
