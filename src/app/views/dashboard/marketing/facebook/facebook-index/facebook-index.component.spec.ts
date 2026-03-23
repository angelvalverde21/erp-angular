import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookIndexComponent } from './facebook-index.component';

describe('FacebookIndexComponent', () => {
  let component: FacebookIndexComponent;
  let fixture: ComponentFixture<FacebookIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
