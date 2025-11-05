import { JsonPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { environment } from '../../../../../../core/environments/environment';

@Component({
  selector: 'app-button-link',
  imports: [RouterModule, FontAwesomeModule, JsonPipe],
  templateUrl: './button-link.component.html',
  styleUrl: './button-link.component.scss',
})
export class ButtonLinkComponent implements OnInit {

  @Input() color: string = 'dark';
  @Input() icon: any;
  @Input() path: any;
  @Input() colortext: string = '';
  @Input() size: string = 'sm';
  @Input() btn: string = 'btn';
  @Input() routeTransform: boolean = true;
  
  // prefix: any[] = [];
  link: any[] = [];

  constructor(){
  
  }

  ngOnInit(): void {
    // console.log(this.path);
    
    // const prefix = environment.showStoreNameInSlug ? [environment.storeName] : ['/'];
    // this.link = [...prefix, ...(Array.isArray(this.path) ? this.path : [this.path])];
    // this.link = this._store.getLink(this.path, this.routeTransform);
  
  }

}
