import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTableProductComponent } from './template-table-product.component';

describe('TemplateTableProductComponent', () => {
  let component: TemplateTableProductComponent;
  let fixture: ComponentFixture<TemplateTableProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateTableProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateTableProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
