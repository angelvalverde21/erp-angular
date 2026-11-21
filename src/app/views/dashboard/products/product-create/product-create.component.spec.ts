import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCreateComponent } from './product-create.component';
import { Category } from '../../../../interfaces/category.interface';
import { ProductService } from '../product.service';
import { StoreService } from '../../../stores/store.service';
import { BaseService } from '../../../base.service';

describe('ProductCreateComponent', () => {
  let component: ProductCreateComponent;
  let fixture: ComponentFixture<ProductCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCreateComponent],
      providers: [
        { provide: ProductService, useValue: {} },
        { provide: StoreService, useValue: {} },
        { provide: BaseService, useValue: {} },
      ],
    })
    .overrideComponent(ProductCreateComponent, { set: { imports: [], template: '' } })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selects Mujer when categories arrive and preserves a different user selection', () => {
    fixture.componentRef.setInput('categories', [{ id: 8, name: 'Mujer', slug: 'mujer' } as Category]);
    fixture.detectChanges();
    expect(component.form.get('category_id')!.value).toBe(8);
    component.form.patchValue({ name: 'Blusa' });
    expect(component.form.valid).toBeTrue();
    component.form.get('category_id')!.setValue(9);
    fixture.componentRef.setInput('categories', [{ id: 8, name: 'Mujer', slug: 'mujer' } as Category]);
    fixture.detectChanges();
    expect(component.form.get('category_id')!.value).toBe(9);
  });

  it('finds Mujer in a category tree and leaves selection empty if absent', () => {
    fixture.componentRef.setInput('categories', [{ id: 1, name: 'Ropa', children: [{ id: 8, name: 'MUJER', slug: 'mujer' }] } as Category]);
    fixture.detectChanges();
    expect(component.form.get('category_id')!.value).toBe(8);
    component.form.reset();
    fixture.componentRef.setInput('categories', []);
    fixture.detectChanges();
    expect(component.form.get('category_id')!.value).toBeNull();
    expect(component.form.get('category_id')!.invalid).toBeTrue();
  });
});
