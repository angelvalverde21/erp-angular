import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandIndexRowComponent } from './brand-index-row.component';

describe('BrandIndexRowComponent', () => {
  let component: BrandIndexRowComponent;
  let fixture: ComponentFixture<BrandIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
