import { Component, Input } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { Form } from "../form/Form";
import { IDisplayConfig } from "./FormControlWrapper";
import { InputType } from "./InputType";
import { getValidationClass, handleUniqueClasses, Style } from "./Style";
import { ValidationStatus } from "./ValidationStatus";

@Component({ template: '' })
export default class ReactiveInput implements ControlValueAccessor {
  @Input() validationStatus: ValidationStatus = ValidationStatus.IDLE;
  @Input() displayConfig!: IDisplayConfig
  @Input() classAppend: string = '';
  @Input() class: string = '';
  @Input() value!: any;
  @Input() form!: Form;

  InputType = InputType;
  ValidationStatus = ValidationStatus;
  Style = Style;

  get placeholderValue() { return this.displayConfig.placeholder ? this.displayConfig.placeholder : this.defaultPlaceholder }
  get typeValue() { return this.displayConfig.inputType ? this.displayConfig.inputType : this.defaultType }

  defaultBaseValidationClass: string = Style.CLASS_INPUT_VALIDATION;
  defaultValidClass: string = Style.CLASS_INPUT_VALID;
  defaultInvalidClass: string = Style.CLASS_INPUT_INVALID;
  defaultClass: string = '';
  defaultPlaceholder: string = 'Enter value'
  defaultType = InputType.TEXT;

  handleUniqueClasses = handleUniqueClasses;
  getValidationClass = getValidationClass;

  calculateClassWrapper(
    baseValidationClass: string = '',
    validClass: string,
    invalidClass: string) {
    let classStart = this.validationStatus === ValidationStatus.IDLE ? '' : baseValidationClass;
    return classStart.concat(
      ' ',
      handleUniqueClasses(
        this.class ? this.class : this.defaultClass, 
        this.classAppend, 
        getValidationClass(this.validationStatus, validClass, invalidClass)))
  }

  onInputChange($event: any) {
    let targetValue: string = $event.target.value ? $event.target.value : '';
    this.value = this.displayConfig.inputEntity.convertToFormValue(targetValue, this.displayConfig);
    this.writeValue(this.value);
  }

  getDisplayValue(value: any) {
    return this.displayConfig.inputEntity.convertToDisplayValue(value);
  }

  get currentFormValue() {
    let formValue: any = this.form.get(this.displayConfig.formControlName);
    return !!formValue ? formValue.value : null;
  }

  get defaultClassWrapper() {
    return this.calculateClassWrapper(
      this.defaultBaseValidationClass,
      this.defaultValidClass,
      this.defaultInvalidClass
    );
  }
  
  constructor() { }

  onTouch: any = () => {}
  onChange: any = () => {}

  writeValue(value: any) {
    let config = {} as any;
    config[this.displayConfig.formControlName] = value;
    this.form.patchValue(config);
    this.value = value
    this.onChange(value)
    this.onTouch(value)
  }

  registerOnChange(fn: any) {
    this.onChange = fn
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn
  }
}