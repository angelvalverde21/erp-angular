import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button-link',
  imports: [RouterModule],
  templateUrl: './button-link.component.html',
  styleUrl: './button-link.component.scss'
})
export class ButtonLinkComponent {

  @Input() color: string = "dark"; 
  @Input() icon: string | null = null; 
  @Input() path: any[] = []; 
  @Input() colortext: string = ""; 
}
