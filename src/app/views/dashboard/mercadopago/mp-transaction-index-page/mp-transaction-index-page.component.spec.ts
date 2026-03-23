import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MpTransactionIndexPageComponent } from './mp-transaction-index-page.component';

describe('MpTransactionIndexPageComponent', () => {
  let component: MpTransactionIndexPageComponent;
  let fixture: ComponentFixture<MpTransactionIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MpTransactionIndexPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MpTransactionIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
