import { Component, Input, OnInit } from '@angular/core';
import { OptionValueCreateComponent } from '../option-value-create/option-value-create.component';
import { HeadPageComponent } from '../../../../../shared/components/head-page/head-page.component';
import { GalleryComponent } from '../../../../../shared/components/gallery/gallery.component';

@Component({
  selector: 'app-option-value-index',
  imports: [
    OptionValueCreateComponent,
    HeadPageComponent,
    GalleryComponent
  ],
  templateUrl: './option-value-index.component.html',
  styleUrl: './option-value-index.component.scss'
})

export class OptionValueIndexComponent implements OnInit {

  @Input() options: any[] = [];
  @Input() create: boolean = true;
  @Input() option_selected="";

  option_values: any[] = [];

  ngOnInit(): void {
    // this.option_values = this.options.flatMap(option => option.values);

    if (this.option_selected != "") {
      this.options = this.options.filter((o:any) => o.name === this.option_selected);
    }
  }

  receiveOptionValue(new_option_value: any) {

    console.log("recibiendo el valor del new_option_value");

    console.log(new_option_value);
    const option = {
      ...new_option_value.option, //aqui armamos primero la opcion (option)
      values: new_option_value //y luego su valor (option->option_value)
    }

    console.log(option);


    this.options = this.options.map(option => {

      if (option.id === new_option_value.option.id) {
        // console.log(option.name);
        option.option_values = [
          ...option.option_values,
          new_option_value
        ]
      }

      return option;

    });

    console.log(this.options);

  }

  removeOptionValue(option_value_id: number) {

  }

}