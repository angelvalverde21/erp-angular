import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowColorSizeComponent } from './row-color-size.component';

describe('RowColorSizeComponent', () => {
  let component: RowColorSizeComponent;
  let fixture: ComponentFixture<RowColorSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowColorSizeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowColorSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
