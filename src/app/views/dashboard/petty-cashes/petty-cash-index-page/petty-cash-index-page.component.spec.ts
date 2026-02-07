import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashIndexPageComponent } from './petty-cash-index-page.component';

describe('PettyCashIndexPageComponent', () => {
  let component: PettyCashIndexPageComponent;
  let fixture: ComponentFixture<PettyCashIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
