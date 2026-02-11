import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryIndexRowComponent } from './gallery-index-row.component';

describe('GalleryIndexRowComponent', () => {
  let component: GalleryIndexRowComponent;
  let fixture: ComponentFixture<GalleryIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
