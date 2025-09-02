import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeRowComponent } from './size-row.component';

describe('SizeRowComponent', () => {
  let component: SizeRowComponent;
  let fixture: ComponentFixture<SizeRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
