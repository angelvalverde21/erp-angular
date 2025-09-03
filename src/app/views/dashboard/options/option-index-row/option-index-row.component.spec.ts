import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionIndexRowComponent } from './option-index-row.component';

describe('OptionIndexRowComponent', () => {
  let component: OptionIndexRowComponent;
  let fixture: ComponentFixture<OptionIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
