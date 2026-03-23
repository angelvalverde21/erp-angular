import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantIndexComponent } from './variant-index.component';

describe('VariantIndexComponent', () => {
  let component: VariantIndexComponent;
  let fixture: ComponentFixture<VariantIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
