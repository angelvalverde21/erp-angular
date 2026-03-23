import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramIndexPageComponent } from './instagram-index-page.component';

describe('InstagramIndexPageComponent', () => {
  let component: InstagramIndexPageComponent;
  let fixture: ComponentFixture<InstagramIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstagramIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstagramIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
