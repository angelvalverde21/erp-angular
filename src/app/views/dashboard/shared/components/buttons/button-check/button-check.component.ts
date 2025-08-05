import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-button-check',
  imports: [FontAwesomeModule],
  templateUrl: './button-check.component.html',
  styleUrl: './button-check.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ButtonCheckComponent),
      multi: true,
    }
  ]
})

export class ButtonCheckComponent implements OnInit, ControlValueAccessor {

  @Input() color: string = "outline-secondary"; // Color del botón
  @Input() icon: string | null = "fa-regular fa-circle-check"; 
  @Input() size: string = "btn-sm"; 
  faCircleCheck = faCircleCheck;
  selectedValue: boolean = false; // Valor seleccionado por defecto

  constructor() {}

  ngOnInit(): void {
    // Initialization logic here
  }

  value: any = '';

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  // Se llama cuando el valor externo cambia (ej. setValue)
  writeValue(value: any): void {
    this.value = value;
  }

  // Se registra una función para llamar cuando cambia el valor desde el componente
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  // Se registra una función para llamar cuando el control es tocado
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  // Si el control puede ser deshabilitado
  setDisabledState?(isDisabled: boolean): void {
    // Implementar si el input debe reaccionar a disable/enable
  }

  // Métodos internos que llaman a las funciones registradas
  onChange(value: any) {
    this.value = value;
    this.onChangeFn(value);
  }

  onTouched() {
    this.onTouchedFn();
  }
  // Other methods and properties can be added here
  

  // Método para manejar el evento de clic
  selected() {
    this.selectedValue = !this.selectedValue; // Cambia el valor seleccionado\
    if(this.selectedValue) {
      this.color = "dark"; // Asigna el valor al componente
      this.icon = "fa-solid fa-circle-check"; // Cambia el icono a null
      this.onChangeFn(true);
    }else{
      this.color = "outline-secondary"; // Asigna el valor al componente
      this.icon = "fa-regular fa-circle-check"; // Cambia el icono a check
      this.onChangeFn(false);
    }
  }

}
