import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashIndexRowComponent } from './petty-cash-index-row.component';

describe('PettyCashIndexRowComponent', () => {
  let component: PettyCashIndexRowComponent;
  let fixture: ComponentFixture<PettyCashIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
