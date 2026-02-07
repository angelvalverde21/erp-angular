import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashIndexComponent } from './petty-cash-index.component';

describe('PettyCashIndexComponent', () => {
  let component: PettyCashIndexComponent;
  let fixture: ComponentFixture<PettyCashIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
