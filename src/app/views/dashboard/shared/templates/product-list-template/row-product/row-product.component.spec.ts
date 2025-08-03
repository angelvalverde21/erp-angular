import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowProductComponent } from './row-product.component';

describe('RowProductComponent', () => {
  let component: RowProductComponent;
  let fixture: ComponentFixture<RowProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
