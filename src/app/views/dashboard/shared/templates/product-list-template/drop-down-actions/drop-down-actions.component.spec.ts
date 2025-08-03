import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownActionsComponent } from './drop-down-actions.component';

describe('DropDownActionsComponent', () => {
  let component: DropDownActionsComponent;
  let fixture: ComponentFixture<DropDownActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropDownActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
