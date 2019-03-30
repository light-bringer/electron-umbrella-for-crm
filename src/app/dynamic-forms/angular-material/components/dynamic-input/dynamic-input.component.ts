import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {DynamicFormControlCustomEvent, DynamicFormControlModel} from '../../models/dynamic-form-control.model';
import {LoggerService} from '@app/utils/services/logger/logger.service';

@Component({
  selector: 'dynamic-input',
  template: `
    <mat-form-field [appearance]="model.appearance"
                    [className]="model.gridItemClass"
                    [formGroup]="formGroup">

      <ng-container *ngIf="model.label" ngProjectAs="mat-label">
        <mat-label> {{ model.label }} </mat-label>
      </ng-container>

      <span *ngIf="model.prefixIconName" matPrefix>
        <mat-icon matPrefix> {{ model.prefixIconName }} </mat-icon>
      </span>

      <input matInput
             [autocomplete]="model.autocomplete"
             [formControlName]="model.id"
             [placeholder]="model.placeholder"
             [required]="model.required"
             [type]="model.inputType"/>

      <span *ngIf="model.suffixIconName" matSuffix>
        <mat-icon matSuffix class="crm-suffix-icon" (click)="iconSuffixClickHandler()"> {{ model.suffixIconName }} </mat-icon>
      </span>

      <ng-container *ngFor="let validator of model.validators;" ngProjectAs="mat-error">
        <mat-error *ngIf="formGroup.controls[model.id].hasError(validator.propertyName)"> {{ validator.message }} </mat-error>
      </ng-container>

    </mat-form-field>
  `,
  styles: []
})
export class DynamicInputComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() model: DynamicFormControlModel;

  @Output() customEvent = new EventEmitter<DynamicFormControlCustomEvent>();

  @HostBinding('class') elementClass;

  constructor(private logger: LoggerService) {

  }

  public ngOnInit() {

    // this.logger.info('DynamicInputComponent: ngOnInit()');
    this.elementClass = this.model.gridItemClass;
  }

  public iconSuffixClickHandler() {

    this.logger.info('DynamicInputComponent: emit customEvent');
    this.customEvent.emit({ type: 'click', id: this.model.id, directive: 'matSuffix', name: this.model.suffixIconName });
  }

}
