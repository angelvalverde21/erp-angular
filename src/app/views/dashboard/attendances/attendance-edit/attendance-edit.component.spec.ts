import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { AttendanceEditComponent } from './attendance-edit.component';
import { AttendanceService } from '../attendance.service';
import { EmployeeService } from '../../users/employees/employee.service';
import { AttendanceJustificationComponent } from '../attendance-justification/attendance-justification.component';
import { UploadDropzoneComponent } from '../../../shared/upload-dropzone/upload-dropzone.component';
import { By } from '@angular/platform-browser';
import { ImageIndexComponent } from '../../images/image-index/image-index.component';

@Component({ selector: 'app-image-index', template: '' })
class JustificationImageIndexStub {
  @Input() images: any[] = [];
  @Input() showUpload = true;
  @Input() allowRemove = true;
}

@Component({ selector: 'app-upload-dropzone', template: '', providers: [{ provide: UploadDropzoneComponent, useExisting: forwardRef(() => JustificationUploadStub) }] })
class JustificationUploadStub {
  @Input() path = '';
  @Input() title = '';
  @Input() acceptedFiles = '';
  @Input() autoUpload = true;
  @Output() pendingFilesChange = new EventEmitter<number>();
  @Output() uploadingChange = new EventEmitter<boolean>();
  uploadQueued = jasmine.createSpy('uploadQueued');
  @Output() fileUpload = new EventEmitter<any>();
  @Output() errorUpload = new EventEmitter<boolean>();
}

describe('Manual remote attendance', () => {
  let service: jasmine.SpyObj<AttendanceService>;
  it('allows custom remote hours and restoring the scheduled day', () => {
    const fixture = TestBed.createComponent(AttendanceEditComponent);
    fixture.componentRef.setInput('attendance', { id: 13, employee_id: 3, date: '2026-11-03', work_type: 'home_office', scheduled_start: '10:00:00', scheduled_end: '19:00:00' });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.toggleRemoteHours();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[formControlName="check_in"]')).not.toBeNull();
    expect(component.form.value.check_in).toBe('10:00:00');
    component.form.patchValue({ check_out: '20:00:00' });
    service.update.and.returnValue(of({ data: {} }));
    component.createOrUpdate();
    expect(service.update).toHaveBeenCalledWith(13, jasmine.objectContaining({ remote_hours_custom: true, check_out: '20:00:00' }));
    component.toggleRemoteHours();
    component.createOrUpdate();
    expect(service.update).toHaveBeenCalledWith(13, jasmine.objectContaining({ remote_hours_custom: false, check_in: null, check_out: null }));
  });
  beforeEach(() => {
    service = jasmine.createSpyObj('AttendanceService', ['store', 'update', 'justify', 'downloadJustification']);
    TestBed.configureTestingModule({ providers: [
      { provide: AttendanceService, useValue: service },
      { provide: EmployeeService, useValue: { index: () => of({ data: [{ id: 3, name: 'Marina' }] }) } },
    ] });
  });

  it('hides physical punches for remote work and clears them from the request without losing the draft on error', () => {
    const fixture = TestBed.createComponent(AttendanceEditComponent);
    fixture.componentRef.setInput('attendance', { employee_id: 3, date: '2026-11-03', check_in: '09:00', check_out: '18:00' });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.form.controls['work_type'].setValue('home_office');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[formControlName="check_in"]')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('jornada programada');
    const response = new Subject<any>();
    service.store.and.returnValue(response);
    component.createOrUpdate();
    component.createOrUpdate();
    expect(service.store).toHaveBeenCalledOnceWith(jasmine.objectContaining({ employee_id: 3, date: '2026-11-03', work_type: 'home_office', check_in: null, check_out: null }));
    response.error({ error: { errors: { work_type: ['Configura un horario laboral válido.'] } } });
    fixture.detectChanges();
    expect(component.form.value.work_type).toBe('home_office');
    expect(fixture.nativeElement.textContent).toContain('Configura un horario laboral válido');
    expect(component.loading).toBeFalse();
  });

  it('shows the dropzone immediately and uploads selected files only after saving the justification', () => {
    TestBed.overrideComponent(AttendanceJustificationComponent, { remove: { imports: [UploadDropzoneComponent] }, add: { imports: [JustificationUploadStub] } });
    const fixture = TestBed.createComponent(AttendanceJustificationComponent);
    fixture.componentRef.setInput('attendance', { employee_id: 3, date: '2026-11-09', missing: true });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const upload = fixture.debugElement.query(By.directive(JustificationUploadStub)).componentInstance as JustificationUploadStub;
    expect(upload.autoUpload).toBeFalse();
    expect(upload.acceptedFiles).toContain('.pdf');
    upload.pendingFilesChange.emit(1);
    component.save();
    expect(service.justify).not.toHaveBeenCalled();
    expect(upload.uploadQueued).not.toHaveBeenCalled();
    component.form.patchValue({ reason: 'Descanso médico' });
    const pending = new Subject<any>();
    service.justify.and.returnValue(pending);
    component.save(); component.save();
    expect(service.justify).toHaveBeenCalledOnceWith({ employee_id: 3, date: '2026-11-09', reason: 'Descanso médico' });
    pending.next({ data: { id: 20, absence_justified: true, justification_documents: [] } });
    pending.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Documento de sustento pendiente');
    expect(upload.path).toBe('attendances/20/justification-documents');
    expect(upload.uploadQueued).toHaveBeenCalledOnceWith('attendances/20/justification-documents');
    component.save();
    expect(service.justify).toHaveBeenCalledTimes(1);
    expect(upload.uploadQueued).toHaveBeenCalledTimes(2);
    upload.fileUpload.emit({ id: 5, name: 'sustento.pdf' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('sustento.pdf');
    expect(fixture.nativeElement.textContent).not.toContain('Documento de sustento pendiente');
  });

  it('shows authenticated image variants in ImageIndex and releases preview URLs when closed', () => {
    TestBed.overrideComponent(AttendanceJustificationComponent, { remove: { imports: [UploadDropzoneComponent, ImageIndexComponent] }, add: { imports: [JustificationUploadStub, JustificationImageIndexStub] } });
    const createUrl = spyOn(URL, 'createObjectURL').and.returnValues('blob:thumbnail', 'blob:medium', 'blob:large');
    const revokeUrl = spyOn(URL, 'revokeObjectURL');
    service.downloadJustification.and.returnValue(of(new Blob(['image'], { type: 'image/webp' })));
    const fixture = TestBed.createComponent(AttendanceJustificationComponent);
    fixture.componentRef.setInput('attendance', { id: 20, absence_justified: true, justification_documents: [{ id: 5, name: 'sustento.png', is_image: true }] });
    fixture.detectChanges();
    const gallery = fixture.debugElement.query(By.directive(JustificationImageIndexStub)).componentInstance as JustificationImageIndexStub;
    expect(gallery.showUpload).toBeFalse();
    expect(gallery.allowRemove).toBeFalse();
    expect(gallery.images[0]).toEqual(jasmine.objectContaining({ url_thumbnail: 'blob:thumbnail', url_medium: 'blob:medium', url_large: 'blob:large' }));
    expect(service.downloadJustification).toHaveBeenCalledWith(20, 5, 'thumbnail');
    expect(service.downloadJustification).toHaveBeenCalledWith(20, 5, 'medium');
    expect(service.downloadJustification).toHaveBeenCalledWith(20, 5, 'large');
    fixture.componentInstance.loadImagePreviews();
    expect(createUrl).toHaveBeenCalledTimes(3);
    fixture.destroy();
    expect(revokeUrl).toHaveBeenCalledTimes(3);
  });

  it('defaults to deducting rest and sends the exception only when selected manually', () => {
    const fixture = TestBed.createComponent(AttendanceEditComponent);
    fixture.componentRef.setInput('attendance', { employee_id: 3, date: '2026-11-03', check_in: '10:00', check_out: '19:00' });
    fixture.detectChanges();
    expect(fixture.componentInstance.form.value.break_skipped).toBeFalse();
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="break_skipped"]');
    checkbox.click();
    service.store.and.returnValue(of({ data: { break_skipped: true, paid_minutes: 540 } }));
    fixture.componentInstance.createOrUpdate();
    expect(service.store).toHaveBeenCalledOnceWith(jasmine.objectContaining({ break_skipped: true }));
  });

  it('loads existing remote attendance and allows changing it back to onsite with actual punches', () => {
    const fixture = TestBed.createComponent(AttendanceEditComponent);
    fixture.componentRef.setInput('attendance', { id: 13, employee_id: 3, date: '2026-11-03', work_type: 'home_office', break_skipped: true });
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.form.value.work_type).toBe('home_office');
    expect(component.form.value.break_skipped).toBeTrue();
    component.form.patchValue({ work_type: 'onsite', check_in: '09:00', check_out: '18:00' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[formControlName="check_in"]')).not.toBeNull();
    service.update.and.returnValue(of({ data: { id: 13, work_type: 'onsite' } }));
    component.createOrUpdate();
    expect(service.update).toHaveBeenCalledOnceWith(13, jasmine.objectContaining({ work_type: 'onsite', check_in: '09:00', check_out: '18:00' }));
  });
});
