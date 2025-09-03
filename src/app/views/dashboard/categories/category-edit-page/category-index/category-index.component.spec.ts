import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryIndexComponent } from './category-index.component';

describe('CategoryIndexComponent', () => {
  let component: CategoryIndexComponent;
  let fixture: ComponentFixture<CategoryIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
