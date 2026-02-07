import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashEditPageComponent } from './petty-cash-edit-page.component';

describe('PettyCashEditPageComponent', () => {
  let component: PettyCashEditPageComponent;
  let fixture: ComponentFixture<PettyCashEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashEditPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
