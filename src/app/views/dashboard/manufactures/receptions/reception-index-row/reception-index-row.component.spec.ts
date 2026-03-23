import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionIndexRowComponent } from './reception-index-row.component';

describe('ReceptionIndexRowComponent', () => {
  let component: ReceptionIndexRowComponent;
  let fixture: ComponentFixture<ReceptionIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
