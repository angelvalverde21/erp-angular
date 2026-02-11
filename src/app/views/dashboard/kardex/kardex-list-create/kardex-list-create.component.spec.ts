import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexListCreateComponent } from './kardex-list-create.component';

describe('KardexListCreateComponent', () => {
  let component: KardexListCreateComponent;
  let fixture: ComponentFixture<KardexListCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexListCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KardexListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
