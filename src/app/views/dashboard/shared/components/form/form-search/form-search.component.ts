import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonService } from '../../../services/common.service';

import { SlugBaseService } from '../../../services/slug/slug-base.service';
import { LoadingComponent } from '../../../components/loading/loading.component';
import { DashboardService } from '../../../../dashboard.service';
// import { DashboardService } from '@erp/store/store.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-form-search',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, FontAwesomeModule],
  templateUrl: './form-search.component.html',
  styleUrl: './form-search.component.css',
})
export class FormSearchComponent implements OnInit {
  searchSubject: Subject<string> = new Subject();

  iconLoading: boolean = false;

  faMagnifyingGlass = faMagnifyingGlass;

  // search: string = '';
  store: any;
  warehouses: any;
  @Input() path: string = '';
  search: string = '';
  hasAuthSearch: boolean = false;
  btnActive: boolean = true;
  warehouse_id: number = 0;
  
  constructor(
    private router: Router,
    private _common: CommonService,
    private _dashboard: DashboardService,
    private route: ActivatedRoute,
    private _slugBase: SlugBaseService
  ) {
    //este es un observable que verifica el estado del iconLoading

    this._common.getIconLoadingObservable().subscribe((value: boolean) => {
      this.iconLoading = value;
      console.log('se recibio el valor ' + value);
    });

    this.route.params.subscribe((params) => {
      console.log('imprimiendo parametros from');
      console.log(params);
      this.search = params['search'];
      this.btnActive = false;
    });
  }

  ngOnInit(): void {
    // Verificar si la URL contiene el segmento "auth"

    this.searchSubject
      .pipe(debounceTime(500)) // Retrasa la búsqueda 300ms después del último evento
      .subscribe((searchTerm: string) => {
        this.redirect(searchTerm);
      });

    console.log('init de form search');

  }

  keyUpSearch(event: any) {
    this.btnActive = true;
    console.log(event.target.value);
    if (event.target.value.length > 3) {
      this.searchSubject.next(event); // Emite el término de búsqueda
    }
  }

  keyEnter(event: any) {
    console.log('click en keyup');
    this.btnActive = true;
    console.log(event);
    this.redirect(event);
  }

  clickSearch($event: any) {
    this.btnActive = true;
    console.log('click en search');
    // console.log($event);
    // console.log(this.search);
    this.redirect($event);
  }

  isNumber(value: string): boolean {
    const parsed = parseFloat(value);
    return !isNaN(parsed) && isFinite(parsed);
  }

  redirect(event: any){

    console.log(event.target.value);
  
    this.router.navigate([this.path, 'search', this.search]);

  }
}
