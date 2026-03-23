import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramIndexComponent } from './instagram-index.component';

describe('InstagramIndexComponent', () => {
  let component: InstagramIndexComponent;
  let fixture: ComponentFixture<InstagramIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstagramIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstagramIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
