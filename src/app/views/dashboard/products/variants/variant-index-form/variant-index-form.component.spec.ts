import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantIndexFormComponent } from './variant-index-form.component';

describe('VariantIndexFormComponent', () => {
  let component: VariantIndexFormComponent;
  let fixture: ComponentFixture<VariantIndexFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariantIndexFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantIndexFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
