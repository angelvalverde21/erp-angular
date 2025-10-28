import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-head-page',
  imports: [FontAwesomeModule],
  templateUrl: './head-page.component.html',
  styleUrl: './head-page.component.scss'
})
export class HeadPageComponent {

  faTag = faTag;

  @Input() title: string = ""; 

}
