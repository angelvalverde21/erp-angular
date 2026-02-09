import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PettyCashService } from '../pettycash.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { PettyCashEditComponent } from '../petty-cash-edit/petty-cash-edit.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';

@Component({
  selector: 'app-petty-cash-edit-page',
  imports: [
    LoadingComponent,
    ButtonBackComponent,
    PettyCashEditComponent,
    HeadPageComponent
  ],
  templateUrl: './petty-cash-edit-page.component.html',
  styleUrl: './petty-cash-edit-page.component.scss'
})
export class PettyCashEditPageComponent implements OnInit {


  petty_cash_id: number = 0;
  petty_cash: any;


  constructor(
    private _pettyCash: PettyCashService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => {
      this.petty_cash_id = params['petty_cash_id'];
    });
  }

  ngOnInit(): void {
    this.pettyCashInit();
  }

  loading: boolean = false;

  pettyCashInit() {

    this.loading = true;

    this._pettyCash.get(this.petty_cash_id).subscribe({

      next: (res: any) => {

        this.loading = false;
        this.petty_cash = res.data;
        console.log(res);
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      }

    });
  }

}
