import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BaseService } from '../../../base.service';
import { BrandService } from '../../brands/brand.service';

import { ProductFormComponent } from './product-form.component';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), { provide: BrandService, useValue: {} }, { provide: BaseService, useValue: { store: 'sorelle', storeName: 'sorelle' } }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    component.section = 'basic';
    component.richDescription = true;
    component.form = new FormGroup({ name: new FormControl('Polo'), body: new FormControl('<p>Tejido <strong>suave</strong></p>') });
    await renderEditor();
  });

  async function renderEditor(): Promise<void> {
    const ready = new Promise<void>(resolve => {
      const created = (editor: { root: HTMLElement }) => { editor.root.id = 'product-form-description'; resolve(); };
      if (jasmine.isSpy(component.descriptionEditorCreated)) (component.descriptionEditorCreated as jasmine.Spy).and.callFake(created);
      else spyOn(component, 'descriptionEditorCreated').and.callFake(created);
    });
    fixture.detectChanges();
    await ready;
    fixture.detectChanges();
  }

  it('renders saved HTML as editable rich text without marking it as a user edit', () => {
    const editor: HTMLElement = fixture.nativeElement.querySelector('.ql-editor');
    expect(editor).not.toBeNull();
    expect(editor.querySelector('strong')!.textContent).toBe('suave');
    expect(component.form.pristine).toBeTrue();
    component.form.get('body')!.setValue('<p>Descripción extensa del producto</p>'.repeat(80));
    fixture.detectChanges();
    const host: HTMLElement = fixture.nativeElement.querySelector('quill-editor');
    const container: HTMLElement = fixture.nativeElement.querySelector('.ql-container');
    expect(container.getBoundingClientRect().bottom).toBeLessThanOrEqual(host.getBoundingClientRect().bottom + 1);
    expect(editor.scrollHeight).toBeGreaterThan(editor.clientHeight);
  });

  it('switches to editable HTML source and keeps the same form value', async () => {
    fixture.nativeElement.querySelector('.product-description-mode').click();
    fixture.detectChanges();
    const source: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(source.value).toContain('<strong>suave</strong>');
    source.value = '<h2>Detalles</h2><p>Nuevo texto</p>';
    source.dispatchEvent(new Event('input'));
    expect(component.form.get('body')!.value).toBe(source.value);
    fixture.nativeElement.querySelector('.product-description-mode').click();
    await renderEditor();
    expect(fixture.nativeElement.querySelector('.ql-editor h2').textContent).toBe('Detalles');
  });
});
