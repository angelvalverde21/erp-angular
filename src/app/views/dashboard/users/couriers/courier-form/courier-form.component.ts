import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTruck, faSliders, faBuilding } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-courier-form',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './courier-form.component.html',
  styleUrl: './courier-form.component.scss'
})
export class CourierFormComponent {
  @Input({ required: true }) form!: FormGroup;

  readonly faTruck = faTruck;
  readonly faSliders = faSliders;
  readonly faBuilding = faBuilding;

  hasError(path: string): boolean {
    const control = this.form.get(path);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}