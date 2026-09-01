import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-location-index',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './location-index.component.html',
  styleUrl: './location-index.component.scss'
})
export class LocationIndexComponent {

  @Input() locations: any[] = []; 

}
