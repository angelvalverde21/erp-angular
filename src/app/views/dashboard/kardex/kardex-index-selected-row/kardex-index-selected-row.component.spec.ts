import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexIndexSelectedRowComponent } from './kardex-index-selected-row.component';

describe('KardexIndexSelectedRowComponent', () => {
  let component: KardexIndexSelectedRowComponent;
  let fixture: ComponentFixture<KardexIndexSelectedRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexIndexSelectedRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexIndexSelectedRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
