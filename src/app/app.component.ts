import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { catchError, delay, filter, map, switchMap, tap } from 'rxjs/operators';

import { ColorModeService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { StoreService } from './core/services/store.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  title = '3b - Angular';

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #titleService = inject(Title);

  readonly #colorModeService = inject(ColorModeService);
  readonly #iconSetService = inject(IconSetService);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {
    this.#titleService.setTitle(this.title);
    // iconSet singleton
    this.#iconSetService.icons = { ...iconSubset };
    this.#colorModeService.localStorageItemName.set('theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');
  }

  ngOnInit(): void {
    this.#router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
      });

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map((params) => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter((theme) => ['dark', 'light', 'auto'].includes(theme)),
        tap((theme) => {
          this.#colorModeService.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();

    console.log('lo primero que se lee');

    //Setea el nombre de la tienda

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        switchMap(() => {
          const store = this.route.root.firstChild?.snapshot.params['store'];
          return this.storeService.slugIsValid$(store).pipe(
            catchError((err) => {
              this.router.navigate(['/404']);
              return of(false); // devuelve algo para que no se rompa el stream
            })
          );
        })
      )
      .subscribe((respIsValid: boolean) => {
        // console.log(respIsValid);
        if (!respIsValid) {
          console.warn('Slug inválido');
        }
      });
  }
}
