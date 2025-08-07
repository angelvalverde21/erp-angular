import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandIndexSlugPageComponent } from './brand-index-slug-page.component';

describe('BrandIndexSlugPageComponent', () => {
  let component: BrandIndexSlugPageComponent;
  let fixture: ComponentFixture<BrandIndexSlugPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandIndexSlugPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandIndexSlugPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
