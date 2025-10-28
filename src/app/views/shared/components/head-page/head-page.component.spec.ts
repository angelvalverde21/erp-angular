import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadPageComponent } from './head-page.component';

describe('HeadPageComponent', () => {
  let component: HeadPageComponent;
  let fixture: ComponentFixture<HeadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
