import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashCreateComponent } from './petty-cash-create.component';

describe('PettyCashCreateComponent', () => {
  let component: PettyCashCreateComponent;
  let fixture: ComponentFixture<PettyCashCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
