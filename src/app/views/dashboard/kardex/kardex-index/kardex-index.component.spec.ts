import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexIndexComponent } from './kardex-index.component';

describe('KardexIndexComponent', () => {
  let component: KardexIndexComponent;
  let fixture: ComponentFixture<KardexIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
