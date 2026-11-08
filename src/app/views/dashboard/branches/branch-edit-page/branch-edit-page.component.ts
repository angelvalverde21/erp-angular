import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, forkJoin, takeUntil } from 'rxjs';
import { Branch, BranchPayload, BranchAddress } from 'src/app/interfaces/branch.interface';
import { BranchService } from '../branch.service';
import { BranchEditComponent } from '../branch-edit/branch-edit.component';
import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { branchError, markBranchFieldErrors } from '../../branches/branch-api.model';


@Component({ selector: 'app-branch-edit-page', imports: [RouterLink, BranchSectionHeaderComponent, BranchEditComponent], templateUrl: './branch-edit-page.component.html', styleUrl: './branch-edit-page.component.scss' })
export class BranchEditPageComponent implements OnInit, OnDestroy {
  @ViewChild(BranchEditComponent) private editor?: BranchEditComponent;
  record: Branch | null = null;
  addresses: BranchAddress[] = [];
  
  readonly recordId: number;
  loading = true;
  saving = false;
  error = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private _branch: BranchService,
    
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.recordId = Number(this.route.snapshot.paramMap.get('branch_id'));
    
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    if (!Number.isInteger(this.recordId) || this.recordId < 1) { this.error = 'El registro solicitado no es válido.'; this.loading = false; return; }
    this.loading = true;
    this.error = '';
    forkJoin({
      record: this._branch.show(this.recordId),
      addresses: this._branch.addresses(),
      
    }).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        
        this.record = response.record.data;
        this.addresses = response.addresses.data;
        
      },
      error: error => this.error = branchError(error, 'No se pudo cargar el registro.'),
    });
  }
  

  save(payload: BranchPayload): void {
    if (this.saving || !this.record) return;
    this.saving = true;
    this.error = '';
    this._branch.saveChanges(this.recordId, payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudieron guardar los cambios.'); },
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
