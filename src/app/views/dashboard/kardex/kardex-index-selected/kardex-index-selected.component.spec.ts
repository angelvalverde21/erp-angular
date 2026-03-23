import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexIndexSelectedComponent } from './kardex-index-selected.component';

describe('KardexIndexSelectedComponent', () => {
  let component: KardexIndexSelectedComponent;
  let fixture: ComponentFixture<KardexIndexSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexIndexSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexIndexSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
