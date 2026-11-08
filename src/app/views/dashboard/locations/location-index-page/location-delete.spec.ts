import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { BaseService } from '../../../base.service';
import { LocationIndexPageComponent } from './location-index-page.component';

describe('Location deletion', () => {
  let fixture: ComponentFixture<LocationIndexPageComponent>;
  let page: LocationIndexPageComponent;
  let http: HttpTestingController;
  let modal: jasmine.SpyObj<NgbModal>;
  let modalRef: jasmine.SpyObj<NgbModalRef>;
  let router: Router;

  beforeEach(async () => {
    modalRef = jasmine.createSpyObj<NgbModalRef>('NgbModalRef', ['close', 'dismiss']);
    modal = jasmine.createSpyObj<NgbModal>('NgbModal', ['open']);
    modal.open.and.returnValue(modalRef);
    await TestBed.configureTestingModule({
      imports: [LocationIndexPageComponent],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: BaseService, useValue: { store: 'sorelle' } },
        { provide: NgbModal, useValue: modal },
        { provide: ActivatedRoute, useValue: {
          snapshot: { paramMap: convertToParamMap({ branch_id: '1', warehouse_id: '1' }) },
          queryParamMap: of(convertToParamMap({ location_id: '7' })),
        } },
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture = TestBed.createComponent(LocationIndexPageComponent);
    page = fixture.componentInstance;
    fixture.detectChanges();
    http.expectOne(req => req.url.endsWith('/warehouses/1')).flush({ data: {
      id: 1, branch_id: 1, name: 'Tienda', code: 'T1', is_active: true, locations_count: 2,
    } });
    http.expectOne(req => req.url.endsWith('/locations') && req.params.get('warehouse_id') === '1').flush({ data: [
      { id: 7, warehouse_id: 1, parent_id: null, name: 'Zona A', code: 'A', is_active: true },
      { id: 8, warehouse_id: 1, parent_id: null, name: 'Zona B', code: 'B', is_active: true },
    ] });
    fixture.detectChanges();
  });

  afterEach(() => { http.verify(); fixture.destroy(); });

  it('requires confirmation, prevents duplicate requests and removes the selected location after success', () => {
    (fixture.nativeElement.querySelector('.location-delete-button') as HTMLButtonElement).click();
    expect(modal.open).toHaveBeenCalled();
    http.expectNone(req => req.method === 'DELETE');
    page.confirmDelete();
    page.confirmDelete();
    const request = http.expectOne(req => req.url.endsWith('/locations/7') && req.method === 'DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    fixture.detectChanges();
    expect(page.locations.map(location => location.id)).toEqual([8]);
    expect(page.selectedLocationId).toBeNull();
    expect(page.context?.locations_count).toBe(1);
    expect(router.navigate).toHaveBeenCalled();
    expect(modalRef.close).toHaveBeenCalled();
    expect(page.deleting).toBeFalse();
  });

  it('keeps a referenced location and the confirmation open when the API rejects deletion', () => {
    page.requestDelete(page.locations[0]);
    page.confirmDelete();
    http.expectOne(req => req.url.endsWith('/locations/7') && req.method === 'DELETE')
      .flush({ message: 'La ubicación tiene conteos asociados.' }, { status: 409, statusText: 'Conflict' });
    expect(page.locations.map(location => location.id)).toEqual([7, 8]);
    expect(page.deleteError).toContain('conteos asociados');
    expect(page.pendingDelete?.id).toBe(7);
    expect(modalRef.close).not.toHaveBeenCalled();
    expect(page.deleting).toBeFalse();
  });

  it('disables deleting a parent with sublocations while keeping leaf deletion available', () => {
    page.locations = [page.locations[0], { ...page.locations[1], parent_id: 7 }];
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.location-delete-button') as NodeListOf<HTMLButtonElement>;
    expect(buttons[0].disabled).toBeTrue();
    expect(buttons[1].disabled).toBeFalse();
  });
});
