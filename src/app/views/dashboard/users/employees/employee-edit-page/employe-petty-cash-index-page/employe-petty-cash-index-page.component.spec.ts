import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployePettyCashIndexPageComponent } from './employe-petty-cash-index-page.component';

describe('EmployePettyCashIndexPageComponent', () => {
  let component: EmployePettyCashIndexPageComponent;
  let fixture: ComponentFixture<EmployePettyCashIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployePettyCashIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployePettyCashIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
