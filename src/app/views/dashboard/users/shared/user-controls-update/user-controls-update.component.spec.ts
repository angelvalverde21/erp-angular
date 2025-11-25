import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserControlsUpdateComponent } from './user-controls-update.component';

describe('UserControlsUpdateComponent', () => {
  let component: UserControlsUpdateComponent;
  let fixture: ComponentFixture<UserControlsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserControlsUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserControlsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
