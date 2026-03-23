import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashFormComponent } from './petty-cash-form.component';

describe('PettyCashFormComponent', () => {
  let component: PettyCashFormComponent;
  let fixture: ComponentFixture<PettyCashFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
