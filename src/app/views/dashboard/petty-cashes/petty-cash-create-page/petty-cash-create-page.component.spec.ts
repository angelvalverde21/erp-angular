import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PettyCashCreatePageComponent } from './petty-cash-create-page.component';

describe('PettyCashCreatePageComponent', () => {
  let component: PettyCashCreatePageComponent;
  let fixture: ComponentFixture<PettyCashCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PettyCashCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PettyCashCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
