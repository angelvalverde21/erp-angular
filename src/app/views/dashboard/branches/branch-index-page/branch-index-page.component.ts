import { BranchSectionHeaderComponent } from '../../branches/branch-section-header/branch-section-header.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';
import { Branch } from 'src/app/interfaces/branch.interface';
import { BranchService } from '../branch.service';
import { BranchIndexComponent } from '../branch-index/branch-index.component';
import { branchError } from '../../branches/branch-api.model';


@Component({ selector: 'app-branch-index-page', imports: [BranchSectionHeaderComponent, RouterLink, BranchIndexComponent], templateUrl: './branch-index-page.component.html', styleUrl: './branch-index-page.component.scss' })
export class BranchIndexPageComponent implements OnInit, OnDestroy {
  branches: Branch[] = [];
  loading = false;
  error = '';
  page = 1;
  lastPage = 1;
  storeName = '';
  
  private readonly destroy$ = new Subject<void>();

  constructor(
    private _branch: BranchService,
    
  ) {  }

  ngOnInit(): void {
    
    this.load();
  }

  load(page = this.page): void {
    if (this.loading) return;
    
    this.loading = true;
    this.error = '';
    this._branch.list(page).pipe(takeUntil(this.destroy$), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.branches = response.data;
        this.page = response.current_page ?? page;
        this.lastPage = response.last_page ?? 1;
        this.storeName = response.store?.name ?? '';
      },
      error: error => this.error = branchError(error, 'No se pudieron cargar sucursales. Intenta nuevamente.'),
    });
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
