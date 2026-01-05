import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionIndexComponent } from './option-index.component';

describe('OptionIndexComponent', () => {
  let component: OptionIndexComponent;
  let fixture: ComponentFixture<OptionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
