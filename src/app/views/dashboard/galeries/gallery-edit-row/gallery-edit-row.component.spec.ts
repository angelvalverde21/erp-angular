import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryEditRowComponent } from './gallery-edit-row.component';

describe('GalleryEditRowComponent', () => {
  let component: GalleryEditRowComponent;
  let fixture: ComponentFixture<GalleryEditRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryEditRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryEditRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
