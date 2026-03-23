import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryIndexPageComponent } from './gallery-index-page.component';

describe('GalleryIndexPageComponent', () => {
  let component: GalleryIndexPageComponent;
  let fixture: ComponentFixture<GalleryIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
