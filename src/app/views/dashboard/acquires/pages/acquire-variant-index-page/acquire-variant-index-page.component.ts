import { Component, effect, OnInit } from '@angular/core';
import { AcquireVariantIndexComponent } from '../../acquire-variant-index/acquire-variant-index.component';
import { ActivatedRoute } from '@angular/router';
import { AcquireService } from '../../acquire.service';

@Component({
  selector: 'app-acquire-variant-index-page',
  imports: [
    AcquireVariantIndexComponent,
  ],
  templateUrl: './acquire-variant-index-page.component.html',
  styleUrl: './acquire-variant-index-page.component.scss',
})
export class AcquireVariantIndexPageComponent implements OnInit {
  //

  acquire_id: number = 0;
  variants: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private _acquire: AcquireService,
  ) {
    this.route.parent?.params.subscribe((params: any) => {
      console.log(params);

      this.acquire_id = Number(params['acquire_id']);
    });

    effect(() => {
      const event = this._acquire.acquireSingnalEvent();
      if (!event) return;

      this.variants = event.variants ?? [];
      console.log(
        'Variants actualizado acquire-variant-index-page:',
        event,
      );
      console.log(this.variants);
    });
  }



  ngOnInit(): void {}
}
