import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpTransactionIndexComponent } from './mp-transaction-index.component';

describe('MpTransactionIndexComponent', () => {
  let component: MpTransactionIndexComponent;
  let fixture: ComponentFixture<MpTransactionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpTransactionIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpTransactionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
