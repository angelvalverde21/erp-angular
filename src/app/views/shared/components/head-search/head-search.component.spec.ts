import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadSearchComponent } from './head-search.component';

describe('HeadSearchComponent', () => {
  let component: HeadSearchComponent;
  let fixture: ComponentFixture<HeadSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
