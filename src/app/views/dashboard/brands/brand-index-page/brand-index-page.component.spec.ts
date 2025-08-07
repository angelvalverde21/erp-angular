import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandIndexPageComponent } from './brand-index-page.component';

describe('BrandIndexPageComponent', () => {
  let component: BrandIndexPageComponent;
  let fixture: ComponentFixture<BrandIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
