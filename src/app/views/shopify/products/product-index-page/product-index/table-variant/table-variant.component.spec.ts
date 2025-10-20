import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableVariantComponent } from './table-variant.component';

describe('TableVariantComponent', () => {
  let component: TableVariantComponent;
  let fixture: ComponentFixture<TableVariantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableVariantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
