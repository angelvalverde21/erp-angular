import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowSizeComponent } from './row-size.component';

describe('RowSizeComponent', () => {
  let component: RowSizeComponent;
  let fixture: ComponentFixture<RowSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowSizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
