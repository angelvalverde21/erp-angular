import { Component, Input, OnInit } from '@angular/core';
import { OptionCreateComponent } from '../option-create/option-create.component';
import { HeadPageComponent } from '../../../../shared/components/head-page/head-page.component';
import { OptionValueCreateComponent } from '../OptionValues/option-value-create/option-value-create.component';
import { OptionValueIndexComponent } from '../OptionValues/option-value-index/option-value-index.component';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-option-index',
  imports: [
    OptionCreateComponent,
    HeadPageComponent,
    OptionValueCreateComponent,
    OptionValueIndexComponent,
    JsonPipe

  ],
  templateUrl: './option-index.component.html',
  styleUrl: './option-index.component.scss'
})
export class OptionIndexComponent implements OnInit {

  @Input() options_init: any;
  @Input() product_id: number = 0;
  @Input() options: any;

  ngOnInit(): void {

    this.options.forEach((option:any) => {
      this.removeOptionInit(option);
    });

  }

  receiveOption(option: any) {
    this.options = [...this.options, option];
    this.removeOptionInit(option);
  }

  removeOptionInit(option: any) {
    this.options_init = this.options_init.filter((o: any) => o.name !== option.name);
  }

}
