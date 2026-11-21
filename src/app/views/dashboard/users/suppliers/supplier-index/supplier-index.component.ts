import { Component, Input } from '@angular/core';
import { ContactDirectoryComponent } from '../../shared/contact-directory/contact-directory.component';
@Component({ selector: 'app-supplier-index', imports: [ContactDirectoryComponent], templateUrl: './supplier-index.component.html', styleUrl: './supplier-index.component.scss' })
export class SupplierIndexComponent { @Input() suppliers: any[] = []; }
