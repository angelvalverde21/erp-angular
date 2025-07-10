import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryIndexPageComponent } from './category-index-page.component';

describe('CategoryIndexPageComponent', () => {
  let component: CategoryIndexPageComponent;
  let fixture: ComponentFixture<CategoryIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
