import { Component, Input, OnInit } from '@angular/core';
import { faLink, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

import { NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonLinkComponent } from 'src/app/views/shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-category-row',
  imports: [
    ButtonLinkComponent, 
    NgClass, 
    FontAwesomeModule
  ],
  templateUrl: './category-row.component.html',
  styleUrl: './category-row.component.scss',
})
export class CategoryRowComponent implements OnInit{

  @Input() category: any;
  @Input() is_children: boolean = false;

  faLink = faLink;
  faEdit = faEdit;
  faCheck = faCheck;
  colorButton: string = '';

  constructor() {

  }
  ngOnInit(): void {
    this.colorButton = this.is_children ? 'secondary' : 'dark';
  }

}
