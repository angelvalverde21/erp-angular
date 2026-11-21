import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { BaseService } from 'src/app/views/base.service';
import { ManufactureKardexService } from '../../manufactures/manufacture.kardex.service';
import { KardexService } from '../kardex.service';
import { KardexHistoryComponent } from './kardex-history.component';

describe('On-demand kardex history', () => {
  let service: jasmine.SpyObj<ManufactureKardexService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('ManufactureKardexService', ['index', 'setManufactureId']);
    service.index.and.returnValue(of({ data: [{ id: 1, direction: 'in', quantity: 4 }] } as any));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BaseService, useValue: { store: 'sorelle' } }, { provide: KardexService, useValue: { summary: KardexService.prototype.summary } }] });
    TestBed.overrideComponent(KardexHistoryComponent, { set: { providers: [{ provide: ManufactureKardexService, useValue: service }] } });
  });
  function setup() {
    const fixture = TestBed.createComponent(KardexHistoryComponent);
    fixture.componentRef.setInput('manufactureId', 24); fixture.detectChanges(); return fixture;
  }
  function toggle(fixture: ReturnType<typeof setup>, open: boolean) {
    const details = fixture.nativeElement.querySelector('details') as HTMLDetailsElement;
    details.open = open; details.dispatchEvent(new Event('toggle')); fixture.detectChanges();
  }
  it('does not request or render rows until expanded and reuses the result on reopening', () => {
    const fixture = setup(); expect(service.index).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('app-kardex-index')).toBeNull();
    toggle(fixture, true); expect(service.index).toHaveBeenCalledTimes(1);
    expect(service.setManufactureId).toHaveBeenCalledWith(24);
    expect(fixture.nativeElement.querySelectorAll('.kardex-quantity-badge').length).toBe(1);
    toggle(fixture, false); toggle(fixture, true); expect(service.index).toHaveBeenCalledTimes(1); fixture.destroy();
  });
  it('invalidates closed history without fetching and refreshes an expanded history after mutations', () => {
    const fixture = setup(); toggle(fixture, true); toggle(fixture, false);
    fixture.componentRef.setInput('revision', 1); fixture.detectChanges(); expect(service.index).toHaveBeenCalledTimes(1);
    toggle(fixture, true); expect(service.index).toHaveBeenCalledTimes(2);
    fixture.componentRef.setInput('revision', 2); fixture.detectChanges(); expect(service.index).toHaveBeenCalledTimes(3); fixture.destroy();
  });
  it('retains the disclosure and offers retry when a requested history fails', () => {
    const fixture = setup(); service.index.and.returnValue(throwError(() => ({}))); toggle(fixture, true);
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No se pudieron consultar');
    service.index.and.returnValue(of({ data: [] } as any)); fixture.componentInstance.load(); fixture.detectChanges();
    expect(service.index).toHaveBeenCalledTimes(2); expect(fixture.componentInstance.loaded).toBeTrue(); fixture.destroy();
  });
  it('does not issue duplicate requests while a query is pending', () => {
    const fixture = setup(); const pending = new Subject<any>(); service.index.and.returnValue(pending);
    toggle(fixture, true); fixture.componentInstance.load(); expect(service.index).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('[role="status"]').textContent).toContain('Consultando');
    pending.next({ data: [] }); pending.complete(); fixture.destroy();
  });
});
