import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandShowPageComponent } from './brand-show-page.component';

describe('BrandShowPageComponent', () => {
  let component: BrandShowPageComponent;
  let fixture: ComponentFixture<BrandShowPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandShowPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandShowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
