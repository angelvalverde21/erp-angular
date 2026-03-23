import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// fuentes
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
// fin de fuentes
import { UserService } from '../user.service'
import { UserEditComponent } from '../user-edit/user-edit.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-edit-page',
  imports: [
    LoadingComponent,
    UserEditComponent
  ],
  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.scss'
})
export class UserEditPageComponent implements OnInit {


  store: any;
  user_id: number = 0;

  constructor(
    private _user: UserService,

  ) {
    // console.log('this._user.getUser()');
    // console.log(this._user.getUser());
    // console.log(this._user.getUser().id);
  }

  // constructor(private fb: FormBuilder, private route: ActivatedRoute) {

  //   this.route.params.subscribe(params => {
  //   this.product_id = params['product_id'];
  //   });

  // }

  success: boolean = false;
  disabledButton: boolean = true;
  loadingIcon: boolean = false;
  loading: boolean = true;
  user: any;

  ngOnInit(): void {
    this.userInit();
  }

  userInit() {

    this._user.get(this._user.getUser().id).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.user = resp.data;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los datos del usuario', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


}
