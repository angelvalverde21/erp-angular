import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { BranchAddress, BranchPayload } from 'src/app/interfaces/branch.interface';
import { BranchService } from '../branch.service';
import { BranchCreateComponent } from '../branch-create/branch-create.component';
import { branchError, markBranchFieldErrors } from '../../branches/branch-api.model';

@Component({ selector: 'app-branch-create-page', imports: [BranchSectionHeaderComponent, RouterLink, BranchCreateComponent], templateUrl: './branch-create-page.component.html', styleUrl: './branch-create-page.component.scss' })
export class BranchCreatePageComponent implements OnInit, OnDestroy {
  @ViewChild(BranchCreateComponent) private editor?: BranchCreateComponent;

  saving = false;
  loading = true;
  addresses: BranchAddress[] = [];
  error = '';
  
  
  private readonly destroy$ = new Subject<void>();
  constructor(
    private _branch: BranchService,
    private router: Router,
    private route: ActivatedRoute,
  ) {  }

  ngOnInit(): void {
    this._branch.addresses().pipe(takeUntil(this.destroy$)).subscribe({
      next: response => { this.addresses = response.data; this.loading = false; },
      error: error => this.error = branchError(error, 'No se pudieron cargar las direcciones de la empresa.'),
    });
  }
  

  save(payload: BranchPayload): void {
    if (this.saving) return;
    this.saving = true;
    this.error = '';
    this._branch.create(payload).pipe(takeUntil(this.destroy$), finalize(() => this.saving = false)).subscribe({
      next: () => this.router.navigate(['../'], { relativeTo: this.route }),
      error: error => { markBranchFieldErrors(this.editor?.form, error); this.error = branchError(error, 'No se pudo crear sucursal. Intenta nuevamente.'); },
    });
  }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
