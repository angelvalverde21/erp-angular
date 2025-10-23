import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSelectedComponent } from './brand-selected.component';

describe('BrandSelectedComponent', () => {
  let component: BrandSelectedComponent;
  let fixture: ComponentFixture<BrandSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
