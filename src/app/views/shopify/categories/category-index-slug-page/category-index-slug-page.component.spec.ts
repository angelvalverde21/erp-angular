import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryIndexSlugPageComponent } from './category-index-slug-page.component';

describe('CategoryIndexSlugPageComponent', () => {
  let component: CategoryIndexSlugPageComponent;
  let fixture: ComponentFixture<CategoryIndexSlugPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryIndexSlugPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryIndexSlugPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
