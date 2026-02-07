import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashEditComponent } from './petty-cash-edit.component';

describe('PettyCashEditComponent', () => {
  let component: PettyCashEditComponent;
  let fixture: ComponentFixture<PettyCashEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
