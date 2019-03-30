import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidatorModel } from './validator.model';

export interface DynamicFormControlCustomEvent {

  type: string;                    // 'click' string
  id: string;                      // 'organisation.name'
  directive: string;               // 'matSuffix'
  name: string;                    // 'search'

}

export interface DynamicFormControl {

  formGroup: FormGroup;
  model: DynamicFormControlModel;

  customEvent?: EventEmitter<any>;

}

export interface DynamicFormControlModelConfig {

  // Mandatory items

  type: string;                    // "input"
  id: string;                      // "givenName"

  inputType?: string;              // "text"

  // Optional items

  appearance?: string;             // "outline"
  autocomplete?: string;           // aka autoFill
  gridItemClass?: string;          // "grid-column-1"
  hideRequiredMarker?: boolean;    // false
  label?: string;                  // "Given Name"
  name?: string;                   // "givenName"
  placeholder?: string;            // "Given Name"
  prefixIconName?: string;
  required?: boolean;              // false
  suffixIconName?: string;
  options?: string[];

  validators?: ValidatorModel[];

}

export class DynamicFormControlModel {

  // Mandatory items

  type: string;                    // "input"
  id: string;                      // "givenName"

  inputType: string;               // "text"

  // Optional items

  appearance?: string;             // "outline"
  autocomplete?: string;           // aka autoFill
  gridItemClass?: string;          // "grid-column-1"
  hideRequiredMarker?: boolean;    // false
  label?: string;                  // "Given Name"
  name?: string;                   // "givenName"
  placeholder?: string;            // "Given Name"
  prefixIconName?: string;
  required?: boolean;              // false
  suffixIconName?: string;
  options?: string[];
  validators?: ValidatorModel[];

  public constructor(config: DynamicFormControlModelConfig) {

    this.type = config.type;
    this.id = config.id;

    this.inputType = config.inputType || 'text';

    this.appearance = config.appearance || 'outline';
    this.autocomplete = config.autocomplete || null;
    this.gridItemClass = config.gridItemClass || null;
    this.hideRequiredMarker = config.hideRequiredMarker || false;
    this.label = config.label || null;
    this.name = config.name || config.id;
    this.placeholder = config.placeholder || config.label;
    this.prefixIconName = config.prefixIconName || null;
    this.required = config.required || false;
    this.suffixIconName = config.suffixIconName || null;
    this.options = config.options || null;
    this.validators = config.validators || null;

  }
}
