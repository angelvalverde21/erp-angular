import { BaseService } from '../../base.service';
import { PhotoSectionHeaderComponent } from './shared/photo-section-header.component';
import { PhotoSessionWorkspaceComponent } from './photo-session-workspace/photo-session-workspace.component';
import { PhotoSessionDashboardComponent } from './photo-session-dashboard/photo-session-dashboard.component';
import { PhotoSessionAssignmentIndexComponent } from './photo-session-assignment-index/photo-session-assignment-index.component';
import { PhotoSessionTaskService } from './tasks/photo-session-task.service';
import { PhotoSessionTaskCreateComponent } from './tasks/photo-session-task-create/photo-session-task-create.component';
import { PhotoSessionTaskIndexComponent } from './tasks/photo-session-task-index/photo-session-task-index.component';
import { EMPTY_TASK_SUMMARY, PhotoTask } from './tasks/photo-session-task.model';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PhotoSessionCreatePageComponent } from './photo-session-create-page/photo-session-create-page.component';
import { PhotoRelatedCreateDialogComponent } from './shared/photo-related-create-dialog/photo-related-create-dialog.component';
import { PhotoSessionCreateComponent } from './photo-session-create/photo-session-create.component';
import { PhotoSessionEditPageComponent } from './photo-session-edit-page/photo-session-edit-page.component';
import { PhotoSessionIndexComponent } from './photo-session-index/photo-session-index.component';
import { PhotoSessionService } from './photo-session.service';
import { PhotoSessionUploadService, PhotoUploadTask } from './photo-session-upload.service';
import { PhotoSessionUploadComponent } from './photo-session-upload/photo-session-upload.component';
import { PhotoSessionUploadDialogComponent } from './photo-session-upload-dialog/photo-session-upload-dialog.component';
import { PhotoSessionAssetIndexComponent } from './photo-session-asset-index/photo-session-asset-index.component';
import { PhotoDialogComponent } from './shared/photo-dialog/photo-dialog.component';
import { PhotoSession, PhotoSessionOptions } from './photo-session.model';
import { navPhotoSessions } from '../../../layout/default-layout/navs/_nav.photo-sessions';
import { routes } from './routes.photo-session';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes as contactRoutes } from './contacts/routes.photo-contact';
import { PhotoContactService } from './contacts/photo-contact.service';
import { PhotoContactCreateComponent } from './contacts/photo-contact-create/photo-contact-create.component';
import { ImageService } from '../images/image.service';
import { ImageIndexComponent } from '../images/image-index/image-index.component';
import { ImageUploadComponent } from '../images/image-upload/image-upload.component';
import { Subject } from 'rxjs';
import { PhotoLocationCreateComponent } from './locations/photo-location-create/photo-location-create.component';
import { PhotoLocationService } from './locations/photo-location.service';
import { PhotoLocation } from './locations/photo-location.model';
import { routes as locationRoutes } from './locations/routes.photo-location';
import { DistrictService } from '../addresses/input-district-id/district.service';
import { By } from '@angular/platform-browser';
import { InputDistrictIdComponent } from '../addresses/input-district-id/input-district-id.component';

const session: PhotoSession = { id: 3, name: 'Catálogo verano', status: 'planned', shoot_date: '2026-12-01', starts_at: '09:00:00', ends_at: '15:00:00', delivery_date: '2026-12-05', responsible_id: null, collection: 'Verano', location: 'Estudio', photographer: 'Fotógrafo', team: null, brief: null, notes: null, budget: 800, photos_count: 5, videos_count: 2, total_bytes: 1024 ** 3 };
const options: PhotoSessionOptions = { employees: [], storage: { configured: false, provider: 'Backblaze B2', max_bytes: 100 * 1024 ** 3 } };

describe('Photo sessions', () => {
  let service: jasmine.SpyObj<PhotoSessionService>;
  let contacts: jasmine.SpyObj<PhotoContactService>;
  let images: jasmine.SpyObj<ImageService>;
  let locations: jasmine.SpyObj<PhotoLocationService>;
  let districts: jasmine.SpyObj<DistrictService>;
  let tasks: jasmine.SpyObj<PhotoSessionTaskService>;
  beforeEach(() => {
    service = jasmine.createSpyObj('PhotoSessionService', ['options', 'show', 'create', 'saveChanges', 'assignments', 'assets', 'beginUpload', 'part', 'complete', 'abort', 'previewBatch', 'confirmPreviews']);
    service.options.and.returnValue(of({ data: options })); service.show.and.returnValue(of({ data: { ...session } }));
    service.assets.and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1 }));
    contacts = jasmine.createSpyObj('PhotoContactService', ['list', 'show', 'create', 'saveChanges']);
    contacts.list.and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1 }));
    images = jasmine.createSpyObj('ImageService', ['store', 'destroy']); images.destroy.and.returnValue(of({ data: null }));
    locations = jasmine.createSpyObj('PhotoLocationService', ['list', 'show', 'create', 'saveChanges']);
    locations.list.and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1 }));
    districts = jasmine.createSpyObj('DistrictService', ['get', 'searchText']);
    districts.get.and.returnValue(of({ data: { id: 150122, name: 'Miraflores', province: { name: 'Lima', department: { name: 'Lima' } } } }));
    districts.searchText.and.returnValue(of([]));
    tasks = jasmine.createSpyObj('PhotoSessionTaskService', ['list', 'createTask', 'editTask', 'changeStatus', 'events']);
    tasks.list.and.returnValue(of({ data: [], total: 0, current_page: 1, last_page: 1, can_manage: false, assignees: [], summary: EMPTY_TASK_SUMMARY }));
    tasks.events.and.returnValue(of({ data: [] }));
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: BaseService, useValue: { store: 'sorelle' } }, { provide: PhotoSessionService, useValue: service }, { provide: PhotoContactService, useValue: contacts }, { provide: ImageService, useValue: images }, { provide: PhotoLocationService, useValue: locations }, { provide: DistrictService, useValue: districts }, { provide: PhotoSessionTaskService, useValue: tasks },
      { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ photo_session_id: '3' })), snapshot: { queryParams: {}, params: {}, data: {}, url: [] } } },
    ] });
  });
  it('keeps global directory navigation out of page headers', () => {
    const fixture = TestBed.createComponent(PhotoSectionHeaderComponent);
    fixture.componentRef.setInput('section', 'model');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('nav')).toBeNull();
    expect(fixture.nativeElement.querySelector('.section-symbol .fa-user')).not.toBeNull();
    fixture.destroy();
  });
  it('shows only the selected session assignments and links to their store-scoped records', () => {
    const fixture = TestBed.createComponent(PhotoSessionWorkspaceComponent);
    fixture.componentRef.setInput('session', { ...session, photographers: [{ id: 10, name: 'Fotógrafa asignada' }, { id: 11, name: 'Segundo fotógrafo' }], models: [{ id: 20, name: 'Modelo asignada', active: true }], locations: [{ id: 30, name: 'Estudio asignado', address: { primary: 'Calle de prueba' } }, { id: 31, name: 'Segunda locación' }] });
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.session-navigation button');
    expect(buttons.length).toBe(6);
    expect(fixture.componentInstance.count('models')).toBe(1);
    const panel = fixture.nativeElement.querySelector('#session-models') as HTMLElement;
    expect(panel.hidden).toBeTrue();
    (fixture.nativeElement.querySelector('#session-nav-models') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(panel.hidden).toBeFalse();
    expect((fixture.nativeElement.querySelector('#session-photographers') as HTMLElement).hidden).toBeTrue();
    expect((fixture.nativeElement.querySelector('#session-session') as HTMLElement).hidden).toBeTrue();
    expect(fixture.nativeElement.querySelector('#session-nav-models').getAttribute('aria-selected')).toBe('true');
    expect(panel.textContent).toContain('Modelo asignada');
    expect(panel.querySelector('a')?.getAttribute('href')).toBe('/sorelle/dashboard/photo-sessions/models/20');
    expect(fixture.nativeElement.querySelector('#session-photographers a')?.getAttribute('href')).toBe('/sorelle/dashboard/photo-sessions/photographers/10');
    expect(fixture.nativeElement.querySelector('#session-locations a')?.getAttribute('href')).toBe('/sorelle/dashboard/photo-sessions/locations/30');
    expect(fixture.componentInstance.count('photographers')).toBe(2); expect(fixture.componentInstance.count('locations')).toBe(2);
    fixture.destroy();
  });
  it('supports keyboard navigation between the session sections', () => {
    const fixture = TestBed.createComponent(PhotoSessionWorkspaceComponent);
    fixture.componentRef.setInput('session', session); fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>;
    expect(tabs[0].textContent).toContain('Resumen');
    tabs[0].focus(); tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })); fixture.detectChanges();
    expect(fixture.componentInstance.activeSection).toBe('tasks'); expect(document.activeElement).toBe(tabs[1]);
    expect(tabs[1].tabIndex).toBe(0); expect(tabs[0].tabIndex).toBe(-1);
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })); fixture.detectChanges();
    expect(fixture.componentInstance.activeSection).toBe('library');
    tabs[5].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })); fixture.detectChanges();
    expect(fixture.componentInstance.activeSection).toBe('session'); fixture.destroy();
  });
  it('starts with the session details and preserves the editing draft and library between sections', () => {
    service.show.and.returnValue(of({ data: { ...session, responsible_id: 5, responsible: { id: 5, name: 'Responsable único' } } }));
    const fixture = TestBed.createComponent(PhotoSessionEditPageComponent); fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('#session-session') as HTMLElement;
    const libraryPanel = fixture.nativeElement.querySelector('#session-library') as HTMLElement;
    const library = libraryPanel.querySelector('app-photo-session-asset-index');
    expect(library).not.toBeNull(); expect(libraryPanel.hidden).toBeTrue();
    expect(panel.querySelector('app-photo-session-asset-index')).toBeNull();
    expect(panel.hidden).toBeFalse(); expect(panel.textContent).toContain('Responsable único');
    expect(panel.querySelector('app-photo-session-details')).not.toBeNull();
    fixture.componentInstance.toggleDetailsEdit(); fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(PhotoSessionDashboardComponent))).toBeNull();
    const form = fixture.debugElement.query(By.directive(PhotoSessionCreateComponent)).componentInstance as PhotoSessionCreateComponent;
    form.form.controls.name.setValue('Cambios sin guardar');
    (fixture.nativeElement.querySelector('#session-nav-tasks') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(panel.hidden).toBeTrue();
    (fixture.nativeElement.querySelector('#session-nav-session') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(panel.hidden).toBeFalse();
    expect(fixture.debugElement.query(By.directive(PhotoSessionCreateComponent)).componentInstance).toBe(form);
    expect(form.form.controls.name.value).toBe('Cambios sin guardar');
    (fixture.nativeElement.querySelector('#session-nav-library') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(libraryPanel.hidden).toBeFalse(); expect(panel.hidden).toBeTrue();
    expect(libraryPanel.querySelector('app-photo-session-asset-index')).toBe(library);
    fixture.componentInstance.toggleDetailsEdit(); fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(PhotoSessionDashboardComponent))).not.toBeNull();
    expect(service.assets).toHaveBeenCalledTimes(1); fixture.destroy();
  });
  it('offers assignment editing when a session has no models and updates its own counts', () => {
    const fixture = TestBed.createComponent(PhotoSessionWorkspaceComponent);
    fixture.componentRef.setInput('session', { ...session, photographer: null, location: null, models: [] });
    fixture.detectChanges();
    expect(fixture.componentInstance.count('models')).toBe(0);
    expect(fixture.componentInstance.count('photographers')).toBe(0);
    expect(fixture.componentInstance.count('locations')).toBe(0);
    const create = spyOn(fixture.componentInstance.createRelated, 'emit');
    expect(fixture.nativeElement.querySelector('#session-models .person-card')).toBeNull();
    (fixture.nativeElement.querySelector('#session-models .create-button') as HTMLButtonElement).click();
    expect(create).toHaveBeenCalledWith('model');
    fixture.componentRef.setInput('session', { ...session, models: [{ id: 40, name: 'Otra modelo', active: true }] });
    fixture.detectChanges();
    expect(fixture.componentInstance.count('models')).toBe(1);
    expect(fixture.nativeElement.querySelector('#session-models').textContent).toContain('Otra modelo');
    fixture.destroy();
  });
  it('uses the session-wide task summary in the dashboard and refreshes its progress after a task reload', async () => {
    const summary = { total: 8, completed: 4, pending: 2, in_progress: 1, blocked: 1, overdue: 2 };
    const taskPage = { data: [], total: 8, current_page: 1, last_page: 1, can_manage: false, assignees: [], summary };
    tasks.list.and.returnValue(of(taskPage));
    const fixture = TestBed.createComponent(PhotoSessionEditPageComponent); fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    const dashboard = fixture.debugElement.query(By.directive(PhotoSessionDashboardComponent));
    const progress = () => dashboard.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    expect(progress().getAttribute('aria-valuenow')).toBe('50');
    expect(progress().getAttribute('aria-valuetext')).toBe('4 de 8 tareas completadas');
    expect(dashboard.nativeElement.querySelectorAll('.attention-item.has-alert').length).toBe(2);
    expect(tasks.list).toHaveBeenCalledOnceWith({ photo_session_id: '3', status: 'all', page: '1' });
    const taskList = fixture.debugElement.query(By.directive(PhotoSessionTaskIndexComponent)).componentInstance as PhotoSessionTaskIndexComponent;
    tasks.list.and.returnValue(of({ ...taskPage, summary: { ...summary, completed: 6, pending: 0 } }));
    taskList.load(); await fixture.whenStable(); fixture.detectChanges();
    expect(progress().getAttribute('aria-valuenow')).toBe('75');
    expect(progress().getAttribute('aria-valuetext')).toBe('6 de 8 tareas completadas');
    expect(dashboard.nativeElement.querySelector('.dashboard-resources')).toBeNull();
    (dashboard.nativeElement.querySelector('.panel-header button') as HTMLButtonElement).click(); fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('#session-tasks') as HTMLElement).hidden).toBeFalse();
    expect(tasks.list).toHaveBeenCalledTimes(2); fixture.destroy();
  });
  it('shows a failed task summary as unavailable instead of inventing a progress value', async () => {
    tasks.list.and.returnValue(throwError(() => ({ status: 503, error: { message: 'Servicio no disponible' } })));
    const fixture = TestBed.createComponent(PhotoSessionEditPageComponent); fixture.detectChanges(); await fixture.whenStable(); fixture.detectChanges();
    const dashboard = fixture.debugElement.query(By.directive(PhotoSessionDashboardComponent));
    expect(dashboard.componentInstance.taskState.loading).toBeFalse();
    expect(dashboard.nativeElement.querySelector('[role="progressbar"]')).toBeNull();
    expect(dashboard.nativeElement.textContent).toContain('No se pudo consultar el avance');
    expect(dashboard.nativeElement.querySelector('.no-alerts')).toBeNull(); fixture.destroy();
  });
  it('distinguishes a session without tasks from one with all tasks completed', () => {
    const fixture = TestBed.createComponent(PhotoSessionDashboardComponent);
    fixture.componentRef.setInput('summary', EMPTY_TASK_SUMMARY);
    fixture.componentRef.setInput('taskState', { loading: false, error: '' }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Organiza los preparativos');
    expect(fixture.nativeElement.querySelector('.dashboard-overview').classList.contains('is-empty')).toBeTrue();
    expect(fixture.nativeElement.querySelector('.task-breakdown')).toBeNull();
    expect(fixture.nativeElement.querySelector('.attention-items')).toBeNull();
    expect(fixture.nativeElement.querySelector('.no-alerts')).toBeNull();
    const navigate = spyOn(fixture.componentInstance.navigate, 'emit');
    fixture.componentRef.setInput('resourceCounts', { photographers: 1, models: 0, locations: 1, library: 2 }); fixture.detectChanges();
    const setupButtons = fixture.nativeElement.querySelectorAll('.setup-sections button');
    expect(setupButtons.length).toBe(1);
    expect(setupButtons[0].textContent).toContain('Agregar modelos');
    setupButtons[0].click(); expect(navigate).toHaveBeenCalledWith('models');

    expect(fixture.nativeElement.querySelector('[role="progressbar"]')).toBeNull();
    fixture.componentRef.setInput('summary', { ...EMPTY_TASK_SUMMARY, total: 2, completed: 2 }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="progressbar"]').getAttribute('aria-valuenow')).toBe('100');
    expect(fixture.nativeElement.querySelector('.dashboard-overview').classList.contains('is-empty')).toBeFalse();
    expect(fixture.nativeElement.textContent).toContain('Todas las tareas de preparación están completadas'); fixture.destroy();
  });
  it('keeps the library total independent of filters and updates it after a full refresh', () => {
    service.assets.and.returnValue(of({ data: [], total: 12, current_page: 1, last_page: 1 }));
    const fixture = TestBed.createComponent(PhotoSessionAssetIndexComponent);
    const total = spyOn(fixture.componentInstance.totalChange, 'emit'); fixture.componentRef.setInput('sessionId', 3); fixture.detectChanges();
    expect(total).toHaveBeenCalledOnceWith(12);
    service.assets.and.returnValue(of({ data: [], total: 2, current_page: 1, last_page: 1 }));
    fixture.componentInstance.kind = 'photo'; fixture.componentInstance.load();
    expect(total).toHaveBeenCalledTimes(1);
    service.assets.and.returnValue(of({ data: [], total: 14, current_page: 1, last_page: 1 }));
    fixture.componentInstance.refreshAfterUpload(); expect(total.calls.mostRecent().args).toEqual([14]); fixture.destroy();
  });
  it('adds directory records without duplicating assignments and detaches only the session link', () => {
    const fixture = TestBed.createComponent(PhotoSessionAssignmentIndexComponent);
    fixture.componentRef.setInput('kind', 'photographer'); fixture.componentRef.setInput('contacts', [{ id: 10, name: 'Asignado' }]);
    fixture.componentRef.setInput('options', [{ id: 10, name: 'Asignado', active: true }, { id: 11, name: 'Disponible', active: true }]); fixture.detectChanges();
    expect(fixture.componentInstance.availableOptions.map(option => option.id)).toEqual([11]);
    const change = spyOn(fixture.componentInstance.changeAssignment, 'emit');
    fixture.componentInstance.selectedIds = [11]; fixture.componentInstance.attach();
    expect(change).toHaveBeenCalledWith({ kind: 'photographer', ids: [11], mode: 'attach' });
    fixture.componentInstance.remove(10); expect(change).toHaveBeenCalledWith({ kind: 'photographer', ids: [10], mode: 'detach' });
    fixture.destroy();
  });
  it('opens a location in Maps without loading an embedded map in the session', () => {
    const fixture = TestBed.createComponent(PhotoSessionAssignmentIndexComponent);
    const location = { id: 7, name: 'Estudio', address: { primary: 'Av. Pardo 123', district: { name: 'Miraflores' }, city: 'Lima' } } as PhotoLocation;
    fixture.componentRef.setInput('kind', 'location'); fixture.componentRef.setInput('locations', [location]); fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('.map-link') as HTMLAnchorElement;
    expect(link.textContent).toContain('Ver en Google Maps'); expect(link.target).toBe('_blank');
    expect(new URL(link.href).searchParams.get('query')).toBe('Av. Pardo 123, Miraflores, Lima, Perú');
    expect(fixture.nativeElement.querySelector('iframe')).toBeNull(); fixture.destroy();
  });
  it('uses a saved Maps link or valid coordinates and rejects unsafe URLs', () => {
    const fixture = TestBed.createComponent(PhotoSessionAssignmentIndexComponent);
    const component = fixture.componentInstance;
    const location = { id: 7, name: 'Estudio', address: { primary: 'Calle 123', latitud: -12.12, longitud: -77.03, url_maps: 'https://maps.app.goo.gl/example' } } as PhotoLocation;
    expect(component.mapUrl(location)).toBe('https://maps.app.goo.gl/example');
    location.address!.url_maps = 'javascript:alert(1)';
    expect(new URL(component.mapUrl(location)!).searchParams.get('query')).toBe('-12.12,-77.03');
    location.address!.latitud = 0; location.address!.longitud = 0;
    expect(new URL(component.mapUrl(location)!).searchParams.get('query')).toBe('0,0');
    location.address!.latitud = 999;
    expect(new URL(component.mapUrl(location)!).searchParams.get('query')).toBe('Calle 123, Perú');
    location.address = null; expect(component.mapUrl(location)).toBeNull(); fixture.destroy();
  });
  it('creates a model from the session card and attaches it without remounting the media library', async () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const model = { id: 21, kind: 'model' as const, name: 'Modelo nueva', active: true, phone: null, email: null, instagram: null, portfolio_url: null, company: null, notes: null };
    contacts.create.and.returnValue(of({ data: model }));
    service.assignments.and.returnValue(of({ data: { ...session, model_ids: [21], models: [model] } }));
    const fixture = TestBed.createComponent(PhotoSessionEditPageComponent); fixture.detectChanges();
    const library = fixture.nativeElement.querySelector('app-photo-session-asset-index');
    (fixture.nativeElement.querySelector('#session-models .create-button') as HTMLButtonElement).click(); fixture.detectChanges();
    const create = fixture.debugElement.query(By.directive(PhotoContactCreateComponent)).componentInstance as PhotoContactCreateComponent;
    create.form.controls.name.setValue('Modelo nueva'); create.submit(); await fixture.whenStable(); fixture.detectChanges();
    expect(service.assignments).toHaveBeenCalledWith(3, 'model', [21], 'attach');
    expect(fixture.nativeElement.querySelector('#session-models').textContent).toContain('Modelo nueva');
    expect(fixture.nativeElement.querySelector('app-photo-session-asset-index')).toBe(library);
    expect(service.show).toHaveBeenCalledTimes(1); fixture.destroy();
  });
  it('keeps the planning draft when assigning people and saves planning without overwriting assignments', () => {
    service.assignments.and.returnValue(of({ data: { ...session, model_ids: [21], models: [{ id: 21, name: 'Modelo agregada', active: true }] } }));
    service.saveChanges.and.returnValue(of({ data: { ...session, name: 'Nombre en edición' } }));
    const fixture = TestBed.createComponent(PhotoSessionEditPageComponent); fixture.detectChanges();
    fixture.componentInstance.editing = true; fixture.detectChanges();
    const form = fixture.debugElement.query(By.directive(PhotoSessionCreateComponent)).componentInstance as PhotoSessionCreateComponent;
    expect(fixture.nativeElement.querySelector('.participants-panel')).toBeNull();
    form.form.controls.name.setValue('Nombre en edición');
    fixture.componentInstance.changeAssignment({ kind: 'model', ids: [21], mode: 'attach' }); fixture.detectChanges();
    expect(form.form.controls.name.value).toBe('Nombre en edición');
    expect(fixture.nativeElement.querySelector('#session-models').textContent).toContain('Modelo agregada');
    form.submit();
    expect(service.saveChanges).toHaveBeenCalledWith(3, jasmine.objectContaining({ name: 'Nombre en edición' }));
    expect(service.saveChanges.calls.mostRecent().args[1].model_ids).toBeUndefined();
    expect(service.saveChanges.calls.mostRecent().args[1].photographer_ids).toBeUndefined(); fixture.destroy();
  });
  it('keeps multiple photographers and locations when creating a session', () => {
    const fixture = TestBed.createComponent(PhotoSessionCreateComponent); fixture.detectChanges();
    fixture.componentInstance.form.patchValue({ name: 'Equipo múltiple', photographer_ids: [10, 11], model_ids: [20, 21], location_ids: [30, 31] });
    const save = spyOn(fixture.componentInstance.save, 'emit'); fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ photographer_ids: [10, 11], model_ids: [20, 21], location_ids: [30, 31] })); fixture.destroy();
  });
  it('requires an employee when creating a preparation task', () => {
    const fixture = TestBed.createComponent(PhotoSessionTaskCreateComponent); fixture.detectChanges();
    const save = spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.form.patchValue({ title: 'Alistar accesorios' }); fixture.componentInstance.submit();
    expect(save).not.toHaveBeenCalled();
    fixture.componentInstance.form.patchValue({ assigned_to: 5, due_date: '2026-12-01', description: 'Separar los aretes' });
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith({ title: 'Alistar accesorios', assigned_to: 5, due_date: '2026-12-01', description: 'Separar los aretes' });
    fixture.destroy();
  });
  it('limits task actions to server permissions and sends the session filter', () => {
    const task: PhotoTask = { id: 1, photo_session_id: 3, title: 'Prendas', description: null, assigned_to: 5, assignee: { id: 5, name: 'Personal' }, session: { id: 3, name: 'Campaña', shoot_date: null }, due_date: null, status: 'pending', last_note: null, completed_at: null, version: 4, overdue: false, can_update: false };
    tasks.list.and.returnValue(of({ data: [task], total: 1, current_page: 1, last_page: 1, can_manage: false, assignees: [], summary: { ...EMPTY_TASK_SUMMARY, total: 1, pending: 1 } }));
    const fixture = TestBed.createComponent(PhotoSessionTaskIndexComponent); fixture.componentRef.setInput('sessionId', 3); fixture.detectChanges();
    expect(tasks.list).toHaveBeenCalledWith({ photo_session_id: '3', status: 'all', page: '1' });
    expect(fixture.nativeElement.textContent).not.toContain('Asignar tarea');
    expect(fixture.nativeElement.textContent).not.toContain('Actualizar avance');
    expect(fixture.nativeElement.textContent).toContain('Prendas'); fixture.destroy();
  });
  it('requires a blocking note and sends the task version when staff updates progress', () => {
    const task: PhotoTask = { id: 1, photo_session_id: 3, title: 'Prendas', description: null, assigned_to: 5, assignee: { id: 5, name: 'Personal' }, session: { id: 3, name: 'Campaña', shoot_date: null }, due_date: null, status: 'pending', last_note: null, completed_at: null, version: 4, overdue: false, can_update: true };
    tasks.changeStatus.and.returnValue(of({ data: { ...task, status: 'blocked', version: 5 } }));
    const fixture = TestBed.createComponent(PhotoSessionTaskIndexComponent); fixture.componentRef.setInput('sessionId', 3); fixture.detectChanges();
    expect(tasks.list).toHaveBeenCalledWith({ photo_session_id: '3', status: 'all', page: '1' });
    fixture.componentInstance.changeStatus(task); fixture.componentInstance.nextStatus = 'blocked'; fixture.componentInstance.saveStatus();
    expect(tasks.changeStatus).not.toHaveBeenCalled();
    fixture.componentInstance.note = 'Faltan prendas'; fixture.componentInstance.saveStatus();
    expect(tasks.changeStatus).toHaveBeenCalledWith(task, 'blocked', 'Faltan prendas');
    fixture.destroy();
  });
  it('lists employees only in the internal responsible selector', () => {
    const fixture = TestBed.createComponent(PhotoSessionCreateComponent);
    fixture.componentRef.setInput('editing', true);
    fixture.componentRef.setInput('options', { ...options, employees: [{ id: 5, employee_id: 90, name: 'Empleado de la tienda' }], users: [{ id: 8, name: 'Usuario sin empleado' }] });
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#photo-responsible');
    expect(select.textContent).toContain('Empleado de la tienda'); expect(select.textContent).not.toContain('Usuario sin empleado');
    fixture.componentInstance.form.patchValue({ name: 'Sesión', responsible_id: 5 });
    const save = spyOn(fixture.componentInstance.save, 'emit'); fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ responsible_id: 5 })); fixture.destroy();
  });
  it('uses the shared district picker and clears the previous selection when its text changes', () => {
    const fixture = TestBed.createComponent(PhotoLocationCreateComponent); fixture.detectChanges();
    const control = fixture.componentInstance.form.controls.address.controls.district_id;
    control.setValue(150122); fixture.detectChanges();
    expect(districts.get).toHaveBeenCalledWith(150122);
    const picker = fixture.debugElement.query(By.directive(InputDistrictIdComponent)).componentInstance as InputDistrictIdComponent;
    expect(picker.name).toContain('Miraflores');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#venue-district');
    input.value = 'Callao'; input.dispatchEvent(new KeyboardEvent('keyup'));
    expect(control.value).toBeNull();
    picker.setName({ id: 150122, name: 'Miraflores', province: { name: 'Lima', department: { name: 'Lima' } } });
    expect(control.value).toBe(150122);
    control.setValue(null); fixture.detectChanges(); expect(picker.name).toBe('');
    fixture.destroy();
  });
  it('opens the locations directory and create page under photo sessions', async () => {
    TestBed.overrideProvider(ActivatedRoute, { useFactory: (router: Router) => router.routerState.root, deps: [Router] });
    TestBed.inject(Router).resetConfig([{ path: 'locations', children: locationRoutes }]);
    const harness = await RouterTestingHarness.create('/locations');
    expect(locations.list).toHaveBeenCalledWith({});
    expect(harness.routeNativeElement?.textContent).toContain('Locaciones');
    await harness.navigateByUrl('/locations/create');
    expect(harness.routeNativeElement?.textContent).toContain('Nueva locación');
    expect(harness.routeNativeElement?.querySelector('app-photo-location-create')).not.toBeNull();
  });
  it('validates location fields and preserves unsaved edits when saving changes', () => {
    const fixture = TestBed.createComponent(PhotoLocationCreateComponent); fixture.detectChanges();
    const save = spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.form.patchValue({ name: 'Cafetería', type: 'cafe', rate: -1 });
    fixture.componentInstance.submit(); expect(save).not.toHaveBeenCalled();
    fixture.componentInstance.form.patchValue({ rate: 0, reference_url: 'https://example.test/local', address: { primary: 'Av. de prueba', district_id: 150122 } });
    fixture.componentRef.setInput('saving', true); fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.address.controls.district_id.value).toBe(150122);
    fixture.componentRef.setInput('saving', false); fixture.detectChanges(); fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Cafetería', type: 'cafe', rate: 0, address: jasmine.objectContaining({ primary: 'Av. de prueba', district_id: 150122 }) }));
    fixture.destroy();
  });
  it('keeps the selected photo location and additional references in the session payload', () => {
    const fixture = TestBed.createComponent(PhotoSessionCreateComponent);
    fixture.componentRef.setInput('options', { ...options, locations: [{ id: 8, name: 'Estudio de prueba', type: 'studio', address: 'Dirección de prueba', active: true }] });
    fixture.componentRef.setInput('session', { ...session, photo_location_id: 8, location: 'Entrada lateral' }); fixture.detectChanges();
    const save = spyOn(fixture.componentInstance.save, 'emit'); fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ photo_location_id: 8, location: 'Entrada lateral' }));
    expect(fixture.nativeElement.querySelector('#photo-venue')).toBeNull();
    fixture.destroy();
  });
  it('opens the model gallery with imageindex thumbnails and a large lightbox target', async () => {
    const picture = { id: 4, name: 'Referencia.jpg', url_thumbnail: 'assets/images/300x300.svg', url_medium: 'assets/model-medium.webp', url_large: 'assets/model-large.jpg' };
    contacts.show.and.returnValue(of({ data: { id: 7, kind: 'model', name: 'Modelo de prueba', active: true, phone: null, email: null, instagram: null, portfolio_url: null, company: null, notes: null, images: [picture] } }));
    TestBed.overrideProvider(ActivatedRoute, { useFactory: (router: Router) => router.routerState.root, deps: [Router] });
    TestBed.inject(Router).resetConfig([{ path: 'models', data: { contactKind: 'model' }, children: contactRoutes }]);
    const harness = await RouterTestingHarness.create('/models/7#reference-images');
    expect(harness.routeNativeElement?.querySelector('#model-tab-gallery')?.getAttribute('aria-selected')).toBe('true');
    expect(harness.routeNativeElement?.querySelector('app-image-index')).not.toBeNull();
    const gallery = harness.routeNativeElement?.querySelector('.image-gallery-grid')!;
    expect(gallery.querySelector('img')?.getAttribute('src')).toBe(picture.url_thumbnail);
    expect(gallery.querySelector('a[data-fancybox]')?.getAttribute('href')).toBe(picture.url_large);
    (gallery.querySelector('.image-gallery-remove') as HTMLButtonElement).click(); harness.detectChanges();
    expect(images.destroy).toHaveBeenCalledWith(4, { imageable_type: 'photo_model', imageable_id: 7 });
    expect(harness.routeNativeElement?.querySelector('.image-gallery-card')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.portrait-image app-image-preview')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.portrait-empty')).not.toBeNull();
  });
  it('preserves unsaved model data between tabs and updates the principal image after an upload', async () => {
    contacts.show.and.returnValue(of({ data: { id: 7, kind: 'model', name: 'Modelo de prueba', active: true, phone: null, email: null, instagram: null, portfolio_url: null, company: null, notes: null, images: [] } }));
    TestBed.overrideProvider(ActivatedRoute, { useFactory: (router: Router) => router.routerState.root, deps: [Router] });
    TestBed.inject(Router).resetConfig([{ path: 'models', data: { contactKind: 'model' }, children: contactRoutes }]);
    const harness = await RouterTestingHarness.create('/models/7');
    expect((harness.routeNativeElement?.querySelector('#model-gallery') as HTMLElement).hidden).toBeTrue();
    const input = harness.routeNativeElement?.querySelector('#contact-name') as HTMLInputElement;
    input.value = 'Cambio sin guardar'; input.dispatchEvent(new Event('input')); harness.detectChanges();
    await harness.navigateByUrl('/models/7#reference-images');
    expect((harness.routeNativeElement?.querySelector('#model-data') as HTMLElement).hidden).toBeTrue();
    const gallery = harness.routeDebugElement!.query(By.directive(ImageIndexComponent)).componentInstance as ImageIndexComponent;
    const picture = { id: 9, name: 'Retrato.jpg', url_thumbnail: 'assets/model-thumb.webp', url_medium: 'assets/model-medium.webp', url_large: 'assets/model-large.jpg' };
    gallery.receiveImagesUpload([picture]); harness.detectChanges();
    expect(harness.routeNativeElement?.querySelector('.portrait-image img')?.getAttribute('src')).toBe(picture.url_thumbnail);
    expect(harness.routeNativeElement?.querySelector('.portrait-image a')?.getAttribute('href')).toBe(picture.url_large);
    await harness.navigateByUrl('/models/7#model-data');
    expect((harness.routeNativeElement?.querySelector('#contact-name') as HTMLInputElement).value).toBe('Cambio sin guardar');
    expect(contacts.show).toHaveBeenCalledTimes(1);
  });
  it('retains the default imageindex table for existing consumers', () => {
    const fixture = TestBed.createComponent(ImageIndexComponent);
    fixture.componentRef.setInput('showUpload', false);
    fixture.componentRef.setInput('images', [{ id: 1, name: 'Referencia.jpg', url_thumbnail: 'assets/images/300x300.svg' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.image-table')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.image-gallery-grid')).toBeNull();
    fixture.destroy();
  });
  it('queues new reference files during upload without resending the active batch', () => {
    const pending = new Subject<{ data: { id: number }[] }>();
    images.store.and.returnValues(pending, of({ data: [{ id: 2 }] }));
    const fixture = TestBed.createComponent(ImageUploadComponent);
    const first = new File(['a'], 'one.jpg', { type: 'image/jpeg' }); const second = new File(['b'], 'two.jpg', { type: 'image/jpeg' });
    fixture.componentRef.setInput('imageable_type', 'photo_model'); fixture.componentRef.setInput('imageable_id', 7);
    fixture.detectChanges();
    fixture.componentInstance.onSelect({ addedFiles: [first] });
    fixture.componentInstance.onSelect({ addedFiles: [second] });
    expect(images.store).toHaveBeenCalledTimes(1);
    pending.next({ data: [{ id: 1 }] }); pending.complete();
    expect(images.store).toHaveBeenCalledTimes(2);
    expect((images.store.calls.argsFor(0)[0] as FormData).getAll('images[]')).toEqual([first]);
    expect((images.store.calls.argsFor(1)[0] as FormData).getAll('images[]')).toEqual([second]);
    expect(fixture.componentInstance.images).toEqual([]); fixture.destroy();
  });
  it('has index, create and edit routes and a dedicated menu', () => {
    expect(navPhotoSessions[0].name).toBe('Sesiones fotográficas');
    expect(navPhotoSessions[0].children?.map(item => item.name)).toEqual(['Sesiones', 'Fotógrafos', 'Modelos', 'Locaciones']);
    expect(routes.map(route => route.path)).toEqual(['', 'create', 'photographers', 'models', 'locations', ':photo_session_id/tasks', ':photo_session_id']);
    expect(routes[6].canDeactivate?.length).toBe(1);
  });
  it('inherits the correct directory kind when navigating to models or photographers', async () => {
    // The real router supplies inherited data from the componentless parent route.
    TestBed.overrideProvider(ActivatedRoute, { useFactory: (router: Router) => router.routerState.root, deps: [Router] });
    TestBed.inject(Router).resetConfig([
      { path: 'models', data: { contactKind: 'model' }, children: contactRoutes },
      { path: 'photographers', data: { contactKind: 'photographer' }, children: contactRoutes },
    ]);
    const harness = await RouterTestingHarness.create('/models');
    expect(contacts.list).toHaveBeenCalledWith('model', {});
    expect(harness.routeNativeElement?.textContent).toContain('Modelos');
    await harness.navigateByUrl('/photographers/create');
    expect(harness.routeNativeElement?.textContent).toContain('Registrar fotógrafo');
  });
  it('keeps selected photographer and models in the session payload', () => {
    const fixture = TestBed.createComponent(PhotoSessionCreateComponent);
    fixture.componentRef.setInput('options', { ...options, photographers: [{ id: 10, name: 'Fotógrafo', active: true }], models: [{ id: 20, name: 'Modelo', active: true }] });
    fixture.componentRef.setInput('session', { ...session, photographer_contact_id: 10, model_ids: [20] });
    fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.photographer_contact_id.value).toBe(10);
    expect(fixture.nativeElement.querySelector('ng-select')).toBeNull();
    const save = spyOn(fixture.componentInstance.save, 'emit'); fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ photographer_contact_id: 10, model_ids: [20] }));
    fixture.destroy();
  });
  it('validates contact data and does not clear the form during saving', () => {
    const fixture = TestBed.createComponent(PhotoContactCreateComponent);
    fixture.componentRef.setInput('kind', 'model'); fixture.detectChanges();
    const save = spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.form.patchValue({ name: 'Modelo de prueba', email: 'invalid' });
    fixture.componentInstance.submit(); expect(save).not.toHaveBeenCalled();
    fixture.componentInstance.form.patchValue({ email: 'modelo@example.test', company: 'Agencia' });
    fixture.componentRef.setInput('saving', true); fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.company.value).toBe('Agencia');
    fixture.componentRef.setInput('saving', false); fixture.detectChanges(); fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ kind: 'model', email: 'modelo@example.test', company: 'Agencia', phone: null }));
    fixture.destroy();
  });
  it('creates initial details without directory assignments', () => {
    service.create.and.returnValue(of({ data: session }));
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(Promise.resolve(true));
    const fixture = TestBed.createComponent(PhotoSessionCreatePageComponent); fixture.detectChanges();
    const form = fixture.debugElement.query(By.directive(PhotoSessionCreateComponent)).componentInstance as PhotoSessionCreateComponent;
    form.form.patchValue({ name: 'Sesión nueva', collection: 'Verano', responsible_id: 5 });
    expect(fixture.nativeElement.querySelector('ng-select')).toBeNull();
    expect(fixture.nativeElement.querySelector('.initial-status').textContent).toContain('Nueva sesión');
    expect(fixture.nativeElement.querySelector('#photo-status')).toBeNull();
    form.submit();
    expect(service.create).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Sesión nueva', collection: 'Verano', responsible_id: 5, status: 'planned',
      photographer_ids: [], model_ids: [], location_ids: [],
    }));
    expect(navigate).toHaveBeenCalled();
    expect(contacts.create).not.toHaveBeenCalled();
    expect(tasks.createTask).not.toHaveBeenCalled();
    fixture.destroy();
  });
  it('preserves initial details when creation fails', () => {
    service.create.and.returnValue(throwError(() => ({ error: { message: 'No se pudo crear la sesión' } })));
    const fixture = TestBed.createComponent(PhotoSessionCreatePageComponent); fixture.detectChanges();
    const form = fixture.debugElement.query(By.directive(PhotoSessionCreateComponent)).componentInstance as PhotoSessionCreateComponent;
    form.form.patchValue({ name: 'Borrador conservado', collection: 'Verano' });
    form.submit(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No se pudo crear la sesión');
    expect(form.form.controls.name.value).toBe('Borrador conservado');
    expect(form.form.controls.collection.value).toBe('Verano');
    expect(fixture.componentInstance.saving).toBeFalse();
    fixture.destroy();
  });
  it('waits for the exit animation before dismissing a dialog and ignores repeated close requests', async () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);
    const fixture = TestBed.createComponent(PhotoRelatedCreateDialogComponent); fixture.componentRef.setInput('kind', 'model'); fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    let finish!: () => void;
    const finished = new Promise<void>(resolve => finish = resolve);
    const animate = spyOn(dialog, 'animate').and.returnValue({ finished, cancel: () => {} } as unknown as Animation);
    const dismissed = spyOn(fixture.componentInstance.cancel, 'emit');
    fixture.componentInstance.requestClose(); fixture.componentInstance.requestClose();
    expect(animate).toHaveBeenCalledTimes(1); expect(dismissed).not.toHaveBeenCalled(); expect(dialog.open).toBeTrue();
    finish(); await fixture.componentInstance.closeAnimated();
    expect(dismissed).toHaveBeenCalledTimes(1); expect(dialog.open).toBeFalse(); fixture.destroy();
  });
  it('defaults new sessions to preparation without showing a status selector and retains assignments', () => {
    const fixture = TestBed.createComponent(PhotoSessionCreateComponent); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#photo-status')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Nueva sesión');
    fixture.componentInstance.form.patchValue({ name: 'Sesión completa', status: 'completed', photographer_contact_id: 10, photographer_ids: [10], model_ids: [20], photo_location_id: 30, location_ids: [30], responsible_id: 5, team: 'Ana · Maquillaje' });
    const save = spyOn(fixture.componentInstance.save, 'emit'); fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ status: 'planned', photographer_contact_id: 10, model_ids: [20], photo_location_id: 30, responsible_id: 5, team: 'Ana · Maquillaje' }));
    fixture.componentRef.setInput('editing', true); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#photo-status')).not.toBeNull();
    fixture.componentInstance.submit(); expect(save.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({ status: 'completed' }));
    fixture.destroy();
  });
  it('validates the name and emits planning data with optional empty fields as null', () => {
    const fixture = TestBed.createComponent(PhotoSessionCreateComponent); fixture.detectChanges();
    const save = spyOn(fixture.componentInstance.save, 'emit');
    fixture.componentInstance.submit(); expect(save).not.toHaveBeenCalled();
    fixture.componentInstance.form.controls.name.setValue('  Sesión verano  ');
    fixture.componentInstance.submit();
    expect(save).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Sesión verano', status: 'planned', shoot_date: null, photographer: null }));
    fixture.destroy();
  });
  it('does not reset edited fields when the saving flag changes', () => {
    const fixture = TestBed.createComponent(PhotoSessionCreateComponent);
    fixture.componentRef.setInput('session', session); fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.starts_at.value).toBe('09:00');
    fixture.componentInstance.form.controls.name.setValue('Nombre editado');
    fixture.componentRef.setInput('saving', true); fixture.detectChanges();
    expect(fixture.componentInstance.form.controls.name.value).toBe('Nombre editado');
    fixture.destroy();
  });
  it('opens employee assignments inside the session and hides unrelated management columns', () => {
    TestBed.overrideProvider(ActivatedRoute, { useFactory: (router: Router) => router.routerState.root, deps: [Router] });
    const fixture = TestBed.createComponent(PhotoSessionIndexComponent);
    fixture.componentRef.setInput('sessions', [session]); fixture.componentRef.setInput('employeeView', true); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.record-name')?.getAttribute('href') || fixture.nativeElement.querySelector('.record-identity a')?.getAttribute('href')).toBe('/3/tasks');
    expect(fixture.nativeElement.textContent).toContain('Ver tareas');
    expect(fixture.nativeElement.textContent).not.toContain('Sin asignar');
    expect(fixture.nativeElement.querySelector('.file-count')).toBeNull(); fixture.destroy();
  });
  it('shows file counts and storage in the session index', () => {
    const fixture = TestBed.createComponent(PhotoSessionIndexComponent);
    fixture.componentRef.setInput('sessions', [session]); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Catálogo verano');
    expect(fixture.nativeElement.textContent).toContain('1 GB');
    expect(fixture.nativeElement.querySelector('.file-count').textContent).toContain('5');
    fixture.destroy();
  });
  it('keeps upload disabled without B2 and guards navigation during an active upload', () => {
    const fixture = TestBed.createComponent(PhotoSessionEditPageComponent); fixture.detectChanges();
    expect(service.show).toHaveBeenCalledWith(3);
    expect(fixture.nativeElement.textContent).toContain('La carga estará disponible');
    expect(fixture.nativeElement.querySelector('input[type=file]')).toBeNull();
    fixture.componentInstance.uploading = true;
    spyOn(window, 'confirm').and.returnValue(false);
    expect(fixture.componentInstance.canLeave()).toBeFalse();
    fixture.destroy();
  });
  it('uploads from the library modal, preserves work while hidden and reveals completed files automatically', async () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const uploader = jasmine.createSpyObj<PhotoSessionUploadService>('PhotoSessionUploadService', ['upload']);
    let finish!: () => void;
    const pending = new Promise<void>(resolve => finish = resolve);
    uploader.upload.and.returnValue(pending);
    TestBed.overrideProvider(PhotoSessionUploadService, { useValue: uploader });
    service.options.and.returnValue(of({ data: { ...options, storage: { ...options.storage, configured: true } } }));
    const fixture = TestBed.createComponent(PhotoSessionEditPageComponent); fixture.detectChanges();
    const modalDebug = fixture.debugElement.query(By.directive(PhotoSessionUploadDialogComponent));
    const dialog = modalDebug.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const shell = modalDebug.query(By.directive(PhotoDialogComponent)).componentInstance as PhotoDialogComponent;
    const queue = modalDebug.query(By.directive(PhotoSessionUploadComponent)).componentInstance as PhotoSessionUploadComponent;
    const library = fixture.debugElement.query(By.directive(PhotoSessionAssetIndexComponent)).componentInstance as PhotoSessionAssetIndexComponent;
    expect(dialog.open).toBeFalse();
    (fixture.nativeElement.querySelector('#session-nav-library') as HTMLButtonElement).click(); fixture.detectChanges();
    (fixture.nativeElement.querySelector('.library-actions .primary') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(dialog.open).toBeTrue(); expect(dialog.querySelectorAll('h2').length).toBe(1);
    const file = new File(['abc'], 'foto.jpg', { type: 'image/jpeg' });
    queue.drop({ preventDefault() {}, dataTransfer: { files: [file] } } as unknown as DragEvent); fixture.detectChanges();
    expect(fixture.componentInstance.uploading).toBeTrue();
    const signal = uploader.upload.calls.mostRecent().args[2];
    (dialog.querySelector('.close-dialog') as HTMLButtonElement).click(); await shell.closeAnimated(); fixture.detectChanges();
    expect(dialog.open).toBeFalse(); expect(signal.aborted).toBeFalse(); expect(queue.tasks[0].state).toBe('uploading');
    expect(fixture.nativeElement.querySelector('.library-actions .primary').textContent).toContain('Ver carga');
    (fixture.nativeElement.querySelector('#session-nav-session') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(signal.aborted).toBeFalse(); expect(queue.tasks[0].state).toBe('uploading');
    (fixture.nativeElement.querySelector('#session-nav-library') as HTMLButtonElement).click(); fixture.detectChanges();
    (fixture.nativeElement.querySelector('.library-actions .primary') as HTMLButtonElement).click(); fixture.detectChanges(); expect(dialog.open).toBeTrue();
    library.kind = 'video'; library.category = 'final'; library.selected = true;
    service.assets.and.returnValue(of({ data: [{ id: 'file-1', name: 'foto.jpg', kind: 'photo', category: 'original', bytes: 3, selected: false, caption: null, status: 'ready', image: null }], total: 1, current_page: 1, last_page: 1 }));
    finish(); await pending; await fixture.whenStable(); await shell.closeAnimated(); fixture.detectChanges();
    expect(dialog.open).toBeFalse(); expect(fixture.componentInstance.uploading).toBeFalse();
    expect(service.assets).toHaveBeenCalledWith(3, { kind: 'all', category: 'all', selected: '0', page: '1' });
    expect(fixture.nativeElement.querySelector('app-photo-session-asset-index').textContent).toContain('foto.jpg');
    expect(fixture.debugElement.query(By.directive(PhotoSessionWorkspaceComponent)).componentInstance.count('library')).toBe(1);
    expect(queue.tasks[0].state).toBe('ready'); fixture.destroy();
  });
  it('refreshes the saved original if generating a preview fails and retains the error for retry', async () => {
    const uploader = jasmine.createSpyObj<PhotoSessionUploadService>('PhotoSessionUploadService', ['upload']);
    uploader.upload.and.callFake(async (_session, task) => { task.originalReady = true; throw new Error('Vista previa interrumpida'); });
    TestBed.overrideProvider(PhotoSessionUploadService, { useValue: uploader });
    const fixture = TestBed.createComponent(PhotoSessionUploadComponent); fixture.componentRef.setInput('sessionId', 3); fixture.componentRef.setInput('configured', true); fixture.detectChanges();
    const completed = spyOn(fixture.componentInstance.completed, 'emit');
    fixture.componentInstance.drop({ preventDefault() {}, dataTransfer: { files: [new File(['abc'], 'foto.jpg')] } } as unknown as DragEvent);
    await fixture.whenStable(); fixture.detectChanges();
    expect(completed).toHaveBeenCalledTimes(1); expect(fixture.componentInstance.tasks[0].state).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('Original guardado'); fixture.destroy();
  });
  it('keeps the upload modal open when an unsupported file is selected after completed uploads', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const fixture = TestBed.createComponent(PhotoSessionUploadDialogComponent); fixture.componentRef.setInput('sessionId', 3); fixture.componentRef.setInput('configured', true); fixture.detectChanges();
    fixture.componentInstance.open();
    const queue = fixture.debugElement.query(By.directive(PhotoSessionUploadComponent)).componentInstance as PhotoSessionUploadComponent;
    queue.tasks = [{ file: new File(['abc'], 'anterior.jpg'), category: 'original', state: 'ready', progress: 100, nextPart: 1 }];
    queue.drop({ preventDefault() {}, dataTransfer: { files: [new File(['abc'], 'documento.txt')] } } as unknown as DragEvent); fixture.detectChanges();
    fixture.componentInstance.progressChanged(false);
    expect((fixture.nativeElement.querySelector('dialog') as HTMLDialogElement).open).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('Formato no admitido'); fixture.destroy();
  });
  it('sends original parts directly without ERP authorization or transforming the file', async () => {
    const plan = { id: 'asset-1', part_bytes: 4, parts: 2 };
    service.beginUpload.and.returnValue(of({ data: plan }));
    service.part.and.callFake((_session, _asset, part) => of({ data: { url: `https://b2.example.test/part-${part}`, headers: { 'x-amz-meta-asset-id': plan.id } } }));
    service.complete.and.returnValue(of({ data: {} as never }));
    const sent: Blob[] = []; const headers: string[] = []; const urls: string[] = [];
    class DirectXHR {
      status = 200; upload = {}; onload: (() => void) | null = null;
      open(_method: string, url: string) { urls.push(url); }
      setRequestHeader(name: string) { headers.push(name); }
      send(body: Blob) { sent.push(body); this.onload?.(); }
      abort() {}
    }
    spyOn(window, 'XMLHttpRequest').and.callFake(function () { return new DirectXHR() as unknown as XMLHttpRequest; });
    const file = new File(['12345678'], 'original.CR3', { type: 'application/octet-stream' });
    const task: PhotoUploadTask = { file, category: 'original', progress: 0, state: 'waiting', nextPart: 1 };
    await TestBed.inject(PhotoSessionUploadService).upload(3, task, new AbortController().signal);
    expect(urls).toEqual(['https://b2.example.test/part-1', 'https://b2.example.test/part-2']);
    expect(sent.map(part => part.size)).toEqual([4, 4]); expect(headers).not.toContain('Authorization');
    expect(headers).toContain('x-amz-meta-asset-id');
    expect(task.file).toBe(file); expect(task.originalReady).toBeTrue(); expect(task.progress).toBe(100);
    expect(service.complete).toHaveBeenCalledOnceWith(3, 'asset-1');
  });

  it('limits the queue to two workers and cancels only the selected upload while accepting more files', async () => {
    const uploader = jasmine.createSpyObj<PhotoSessionUploadService>('PhotoSessionUploadService', ['upload']);
    const releases = new Map<string, () => void>(); const signals = new Map<string, AbortSignal>();
    uploader.upload.and.callFake((_session, task, signal) => new Promise<void>((resolve, reject) => {
      releases.set(task.file.name, resolve); signals.set(task.file.name, signal);
      signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), { once: true });
    }));
    TestBed.overrideProvider(PhotoSessionUploadService, { useValue: uploader });
    const fixture = TestBed.createComponent(PhotoSessionUploadComponent);
    fixture.componentRef.setInput('sessionId', 3); fixture.componentRef.setInput('configured', true); fixture.detectChanges();
    const queue = fixture.componentInstance;
    const drop = (names: string[]) => queue.drop({ preventDefault() {}, dataTransfer: { files: names.map(name => new File(['abc'], name)) } } as unknown as DragEvent);
    const tick = () => new Promise<void>(resolve => setTimeout(resolve, 0));
    drop(['one.jpg', 'two.jpg', 'three.jpg']);
    expect(uploader.upload).toHaveBeenCalledTimes(2); expect(queue.tasks[2].state).toBe('waiting');
    drop(['four.jpg']); queue.cancel(queue.tasks[0]); await tick();
    expect(signals.get('one.jpg')!.aborted).toBeTrue(); expect(signals.get('two.jpg')!.aborted).toBeFalse();
    expect(queue.tasks[0].state).toBe('cancelled'); expect(uploader.upload).toHaveBeenCalledTimes(3);
    releases.get('two.jpg')!(); await tick(); expect(uploader.upload).toHaveBeenCalledTimes(4);
    releases.get('three.jpg')!(); releases.get('four.jpg')!(); await tick();
    expect(queue.tasks.map(task => task.state)).toEqual(['cancelled', 'ready', 'ready', 'ready']);
    expect(queue.busy).toBeFalse(); fixture.destroy();
  });

  for (const failPreview of [false, true]) it(`waits for all concurrent previews before ${failPreview ? 'reporting a failed transfer' : 'confirming them'}`, async () => {
    const plan = { id: 'asset-1', part_bytes: 1024, parts: 1 };
    service.beginUpload.and.returnValue(of({ data: plan }));
    service.part.and.returnValue(of({ data: { url: 'https://b2.example.test/original' } }));
    const verified = new Subject<{ data: never }>(); service.complete.and.returnValue(verified);
    service.previewBatch.and.returnValue(of({ data: { uploads: ['thumb', 'medium', 'large'].map(size => ({ size, url: 'https://b2.example.test/' + size })) } }));
    service.confirmPreviews.and.returnValue(of({ data: {} as never }));
    const bitmap = await createImageBitmap(new ImageData(2, 2));
    spyOn(window, 'createImageBitmap').and.returnValue(Promise.resolve(bitmap));
    const requests: DirectXHR[] = [];
    class DirectXHR {
      status = 200; upload = {}; onload: (() => void) | null = null;
      open() {} setRequestHeader() {} abort() {}
      send() { requests.push(this); if (requests.length === 1) this.onload?.(); }
    }
    spyOn(window, 'XMLHttpRequest').and.callFake(function () { return new DirectXHR() as unknown as XMLHttpRequest; });
    const file = new File(['abc'], 'photo.jpg', { type: 'image/jpeg' });
    const task: PhotoUploadTask = { file, category: 'original', progress: 0, state: 'uploading', nextPart: 1 };
    const upload = TestBed.inject(PhotoSessionUploadService).upload(3, task, new AbortController().signal);
    let settled = false;
    const outcome = upload.then(() => { settled = true; return null; }, error => { settled = true; return error as Error; });
    const tick = () => new Promise<void>(resolve => setTimeout(resolve, 5));
    await tick(); expect(task.phase).toBe('verifying'); expect(service.previewBatch).not.toHaveBeenCalled();
    verified.next({ data: {} as never }); verified.complete();
    for (let attempt = 0; attempt < 100 && requests.length < 4; attempt++) await tick();
    expect(requests.length).toBe(4); expect(task.phase).toBe('uploading_previews');
    expect(service.previewBatch.calls.mostRecent().args[2].map(preview => preview.size)).toEqual(['thumb', 'medium', 'large']);
    if (failPreview) requests[1].status = 500;
    requests[1].onload?.(); requests[2].onload?.(); await tick();
    expect(service.confirmPreviews).not.toHaveBeenCalled(); expect(settled).toBeFalse();
    requests[3].onload?.(); const error = await outcome;
    if (failPreview) { expect(error).toBeInstanceOf(Error); expect(service.confirmPreviews).not.toHaveBeenCalled(); }
    else { expect(error).toBeNull(); expect(service.confirmPreviews).toHaveBeenCalledOnceWith(3, plan.id); }
    expect(task.file).toBe(file);
  });
});
