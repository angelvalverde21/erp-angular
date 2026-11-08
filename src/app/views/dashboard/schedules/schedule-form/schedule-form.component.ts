import { Component, Input, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-schedule-form',
  imports: [ReactiveFormsModule],
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.scss',
})
export class ScheduleFormComponent implements OnDestroy {
  private group!: FormGroup;
  private subscription?: Subscription;

  @Input() set form(value: FormGroup) {
    this.group = value;
    this.subscription?.unsubscribe();
    const update = () => {
      const rest = value.get('work_type')?.value === 'rest';
      for (const field of ['start_time', 'end_time']) {
        value.get(field)?.setValidators(rest ? [] : [Validators.required]);
        value.get(field)?.updateValueAndValidity({ emitEvent: false });
      }
    };
    update();
    this.subscription = value.get('work_type')?.valueChanges.subscribe(update);
  }

  get form(): FormGroup {
    return this.group;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
