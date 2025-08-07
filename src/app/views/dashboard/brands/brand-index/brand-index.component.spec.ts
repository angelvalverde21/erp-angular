import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandIndexComponent } from './brand-index.component';

describe('BrandIndexComponent', () => {
  let component: BrandIndexComponent;
  let fixture: ComponentFixture<BrandIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
