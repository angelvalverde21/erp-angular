import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryCreatePageComponent } from './gallery-create-page.component';

describe('GalleryCreatePageComponent', () => {
  let component: GalleryCreatePageComponent;
  let fixture: ComponentFixture<GalleryCreatePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryCreatePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
