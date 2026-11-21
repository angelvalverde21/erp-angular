import { Component, Input } from '@angular/core';
import { ContactDirectoryComponent } from '../../shared/contact-directory/contact-directory.component';
@Component({ selector: 'app-customer-index', imports: [ContactDirectoryComponent], templateUrl: './customer-index.component.html', styleUrl: './customer-index.component.scss' })
export class CustomerIndexComponent { @Input() customers: any[] = []; }
