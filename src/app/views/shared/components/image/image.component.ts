import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Fancybox } from '@fancyapps/ui';

@Component({
  selector: 'app-image',
  imports: [
    Fancybox,
  ],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent implements OnInit {

  constructor(
    private elRef: ElementRef,
  ) {

  }

  ngOnInit(): void {

    Fancybox.bind(this.elRef.nativeElement, '[data-fancybox]', {
      // Custom options
    })

  }

  @Input() image: any[] = [];

  @Input() title: string = ''; 

}
