import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantIndexSelectedComponent } from './variant-index-selected.component';

describe('VariantIndexSelectedComponent', () => {
  let component: VariantIndexSelectedComponent;
  let fixture: ComponentFixture<VariantIndexSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantIndexSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantIndexSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
