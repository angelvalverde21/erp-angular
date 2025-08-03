import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowColorComponent } from './row-color.component';

describe('RowColorComponent', () => {
  let component: RowColorComponent;
  let fixture: ComponentFixture<RowColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowColorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
