import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../core/auth/auth.service';


@Component({
  selector: 'app-button-logout',
  imports: [],
  templateUrl: './button-logout.component.html',
  styleUrl: './button-logout.component.scss'
})
export class ButtonLogoutComponent implements OnInit{

  constructor(private _auth: AuthService) { // Replace 'any' with the actual type of your auth service
  }
  ngOnInit(): void {
    // const prefix = environment.showStoreNameInSlug ? ['/', environment.storeName, 'logout'] : [];
  }

  logout(){

    this._auth.logout();
    
  }

}
