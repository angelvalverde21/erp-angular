import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionCreateComponent } from './option-create.component';

describe('OptionCreateComponent', () => {
  let component: OptionCreateComponent;
  let fixture: ComponentFixture<OptionCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
