import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantSearchComponent } from './variant-search.component';

describe('VariantSearchComponent', () => {
  let component: VariantSearchComponent;
  let fixture: ComponentFixture<VariantSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
