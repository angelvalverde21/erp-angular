import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { BaseService } from '../../../../base.service';
import { ManufactureProductionService } from '../manufacture.production.service';
import { ManufactureProductionIndexRowComponent } from './manufacture-production-index-row.component';

registerLocaleData(localeEsPe);
describe('Production deletion', () => {
  let destroy: jasmine.Spy;
  let setArchived: jasmine.Spy;
  beforeEach(() => {
    destroy = jasmine.createSpy('destroy').and.returnValue(of({ data: { deleted: true } }));
    setArchived = jasmine.createSpy('setArchived').and.returnValue(of({ data: {} }));
    TestBed.configureTestingModule({ providers: [provideRouter([]),
      { provide: BaseService, useValue: { store: 'sorelle', storeName: 'sorelle' } },
      { provide: ManufactureProductionService, useValue: { destroy, setArchived } },
    ] });
  });
  function setup() {
    const fixture = TestBed.createComponent(ManufactureProductionIndexRowComponent);
    fixture.componentInstance.production = { id: 10, name: 'Lote de prueba' };
    fixture.detectChanges(); return fixture;
  }
  it('deletes the confirmed production and emits its ID for removing the list row', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
    const fixture = setup(), component = fixture.componentInstance;
    const emitted = spyOn(component.deleted, 'emit');
    await component.deleteProduction();
    expect(destroy).toHaveBeenCalledOnceWith(10);
    expect(emitted).toHaveBeenCalledOnceWith(10);
    expect(component.deleting).toBeFalse();
    fixture.destroy();
  });
  it('offers archive instead of delete when inventory history exists and restores archived productions', async () => {
    spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: true } as any);
    const fixture = setup(), component = fixture.componentInstance;
    component.production.can_delete = false;
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.action-menu-toggle').click();
    fixture.detectChanges(); await fixture.whenStable();
    const footer = document.querySelector('.action-menu-footer')!;
    expect(footer.textContent).toContain('Archivar'); expect(footer.textContent).not.toContain('Borrar');
    await component.deleteProduction();
    expect(setArchived).toHaveBeenCalledWith(10, true); expect(destroy).not.toHaveBeenCalled();
    component.production.archived_at = '2026-11-23';
    await component.deleteProduction();
    expect(setArchived).toHaveBeenCalledWith(10, false);
    fixture.destroy();
  });
  it('keeps the production when deletion is cancelled or rejected and allows retry', async () => {
    const dialog = spyOn(Swal, 'fire').and.resolveTo({ isConfirmed: false } as any);
    const fixture = setup(), component = fixture.componentInstance;
    const emitted = spyOn(component.deleted, 'emit');
    await component.deleteProduction(); expect(destroy).not.toHaveBeenCalled();
    dialog.and.resolveTo({ isConfirmed: true } as any);
    destroy.and.returnValue(throwError(() => ({ error: { errors: { production: ['Tiene compras registradas.'] } } })));
    await component.deleteProduction();
    expect(emitted).not.toHaveBeenCalled(); expect(component.deleting).toBeFalse();
    expect(dialog).toHaveBeenCalledWith('No se pudo eliminar', 'Tiene compras registradas.', 'error');
    fixture.destroy();
  });
});
