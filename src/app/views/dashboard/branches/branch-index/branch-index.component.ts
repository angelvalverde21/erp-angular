import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Branch } from 'src/app/interfaces/branch.interface';
@Component({ selector: 'app-branch-index', imports: [RouterLink], templateUrl: './branch-index.component.html', styleUrl: './branch-index.component.scss' })
export class BranchIndexComponent { @Input() branches: Branch[] = []; }
