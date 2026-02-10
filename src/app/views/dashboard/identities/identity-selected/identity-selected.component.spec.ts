import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentitySelectedComponent } from './identity-selected.component';

describe('IdentitySelectedComponent', () => {
  let component: IdentitySelectedComponent;
  let fixture: ComponentFixture<IdentitySelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdentitySelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdentitySelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
