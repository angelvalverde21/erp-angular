import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHeadTableComponent } from './user-head-table.component';

describe('UserHeadTableComponent', () => {
  let component: UserHeadTableComponent;
  let fixture: ComponentFixture<UserHeadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHeadTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHeadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
