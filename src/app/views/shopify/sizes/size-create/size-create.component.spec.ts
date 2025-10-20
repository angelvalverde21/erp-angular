import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SizeCreateComponent } from './size-create.component';

describe('SizeCreateComponent', () => {
  let component: SizeCreateComponent;
  let fixture: ComponentFixture<SizeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SizeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SizeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
