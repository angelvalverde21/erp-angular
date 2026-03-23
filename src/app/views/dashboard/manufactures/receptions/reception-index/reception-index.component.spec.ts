import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionIndexComponent } from './reception-index.component';

describe('ReceptionIndexComponent', () => {
  let component: ReceptionIndexComponent;
  let fixture: ComponentFixture<ReceptionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
