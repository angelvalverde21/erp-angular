import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexIndexRowComponent } from './kardex-index-row.component';

describe('KardexIndexRowComponent', () => {
  let component: KardexIndexRowComponent;
  let fixture: ComponentFixture<KardexIndexRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexIndexRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexIndexRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
