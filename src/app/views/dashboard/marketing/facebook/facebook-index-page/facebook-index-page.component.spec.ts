import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookIndexPageComponent } from './facebook-index-page.component';

describe('FacebookIndexPageComponent', () => {
  let component: FacebookIndexPageComponent;
  let fixture: ComponentFixture<FacebookIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
