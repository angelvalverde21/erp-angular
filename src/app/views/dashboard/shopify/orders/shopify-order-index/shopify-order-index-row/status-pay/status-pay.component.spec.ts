import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusPayComponent } from './status-pay.component';

describe('StatusPayComponent', () => {
  let component: StatusPayComponent;
  let fixture: ComponentFixture<StatusPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusPayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
