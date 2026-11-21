import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BaseService } from '../../../../base.service';
import { ProductionStageAttachmentsComponent } from './production-stage-attachments.component';

describe('Production stage attachments', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: BaseService, useValue: { store: 'sorelle' } }] }));
  afterEach(() => TestBed.inject(HttpTestingController).verify());
  function setup() {
    const fixture = TestBed.createComponent(ProductionStageAttachmentsComponent);
    fixture.componentRef.setInput('productionId', 24); fixture.componentRef.setInput('stageId', 1); fixture.detectChanges();
    TestBed.inject(HttpTestingController).expectOne(request => request.url.endsWith('/24/stages/1/attachments')).flush({ data: [] });
    return fixture;
  }
  it('uploads a file using multipart data and reloads saved files from the server', () => {
    const fixture = setup(); const http = TestBed.inject(HttpTestingController);
    const file = new File(['document'], 'molde.pdf', { type: 'application/pdf' });
    fixture.componentInstance.upload({ files: [file], value: 'molde.pdf' } as unknown as HTMLInputElement);
    const upload = http.expectOne(request => request.method === 'POST' && request.url.endsWith('/24/stages/1/attachments'));
    expect(upload.request.body.get('file')).toBe(file);
    const saved = { id: 9, name: 'molde.pdf', size: 8, created_at: '2026-11-20T12:00:00Z' };
    upload.flush({ data: saved }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('molde.pdf');
    fixture.componentInstance.load();
    http.expectOne(request => request.method === 'GET' && request.url.endsWith('/24/stages/1/attachments')).flush({ data: [saved] });
    expect(fixture.componentInstance.files[0].id).toBe(9);
    fixture.componentRef.setInput('stageId', 2); fixture.detectChanges();
    http.expectOne(request => request.url.endsWith('/24/stages/2/attachments')).flush({ data: [] });
    expect(fixture.componentInstance.files).toEqual([]);
  });
  it('uploads and previews photos for the selected purchase without mixing stage files', () => {
    const fixture = TestBed.createComponent(ProductionStageAttachmentsComponent);
    const http = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('purchaseId', 42); fixture.detectChanges();
    http.expectOne(request => request.url.endsWith('/purchases/42/attachments')).flush({ data: [] });
    const photo = new File(['photo'], 'compra.png', { type: 'image/png' });
    fixture.componentInstance.upload({ files: [photo], value: '' } as unknown as HTMLInputElement);
    const upload = http.expectOne(request => request.method === 'POST' && request.url.endsWith('/purchases/42/attachments'));
    expect(upload.request.body.get('file')).toBe(photo);
    const file = { id: 17, name: 'compra.png', size: 5, created_at: '2026-11-20', mime_type: 'image/png' };
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test-photo');
    const revoke = spyOn(URL, 'revokeObjectURL');
    upload.flush({ data: file });
    http.expectOne(request => request.url.endsWith('/purchases/42/attachments/17/preview')).flush(new Blob(['photo'], { type: 'image/png' }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Archivos adjuntos');
    expect(fixture.nativeElement.querySelector('.attachment-preview img')).not.toBeNull();
    fixture.componentInstance.preview(file);
    http.expectNone(request => request.url.endsWith('/preview'));
    expect(fixture.componentInstance.previewUrl).toBe('blob:test-photo');
    fixture.componentRef.setInput('purchaseId', 43); fixture.detectChanges();
    http.expectOne(request => request.url.endsWith('/purchases/43/attachments')).flush({ data: [] });
    expect(revoke).toHaveBeenCalledWith('blob:test-photo');
    expect(fixture.componentInstance.files).toEqual([]);
    expect(fixture.componentInstance.previewUrl).toBe('');
  });

  it('shows document icons without requesting image previews and publishes the file count', () => {
    const fixture = TestBed.createComponent(ProductionStageAttachmentsComponent);
    const http = TestBed.inject(HttpTestingController);
    const changes = spyOn(fixture.componentInstance.filesChange, 'emit');
    fixture.componentRef.setInput('purchaseId', 42); fixture.detectChanges();
    const files = ['ploteo.pdf', 'ficha.docx', 'presentacion.pptx'].map((name, index) => ({ id: index + 1, name, size: 100, created_at: '2026-11-20' }));
    http.expectOne(request => request.url.endsWith('/purchases/42/attachments')).flush({ data: files }); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.attachment-preview img').length).toBe(0);
    expect(fixture.nativeElement.querySelector('.fa-file-pdf')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.fa-file-word')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.fa-file-powerpoint')).not.toBeNull();
    expect(changes).toHaveBeenCalledWith(files);
    http.expectNone(request => request.url.endsWith('/preview'));
  });

  it('shows server errors and rejects files larger than the allowed size', () => {
    const fixture = setup(); const http = TestBed.inject(HttpTestingController);
    fixture.componentInstance.upload({ files: [{ size: 10485761 }], value: '' } as unknown as HTMLInputElement);
    expect(fixture.componentInstance.error).toContain('10 MB');
    fixture.componentInstance.upload({ files: [new File(['x'], 'file.pdf')], value: '' } as unknown as HTMLInputElement);
    http.expectOne(request => request.method === 'POST').flush({ errors: { file: ['Formato inválido'] } }, { status: 422, statusText: 'Invalid' });
    expect(fixture.componentInstance.error).toBe('Formato inválido');
    expect(fixture.componentInstance.uploading).toBeFalse();
  });
});
