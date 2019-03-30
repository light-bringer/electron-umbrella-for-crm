import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {DynamicFormControlModel} from '../../models/dynamic-form-control.model';
import {LoggerService} from '@app/utils/services/logger/logger.service';


@Component({
  selector: 'dynamic-datepicker',
  template: `
    <mat-form-field [appearance]="model.appearance"
                    [className]="model.gridItemClass"
                    [formGroup]="formGroup">

      <mat-label *ngIf="model.label"> {{ model.label }} </mat-label>

      <input #input matInput
             [formControlName]="model.id"
             [matDatepicker]="picker"
             [placeholder]="model.placeholder"
             [required]="model.required" />

      <mat-icon matSuffix class="crm-suffix-icon" (click)="picker.open()"> event </mat-icon>

      <mat-datepicker #picker></mat-datepicker>

      <ng-container *ngFor="let validator of model.validators;" ngProjectAs="mat-error">
        <mat-error *ngIf="formGroup.controls[model.id].hasError(validator.propertyName)"> {{ validator.message }} </mat-error>
      </ng-container>

    </mat-form-field>
  `,
  styles: []
})
export class DynamicDatepickerComponent implements OnInit {

  @Input() formGroup: FormGroup;
  @Input() model: DynamicFormControlModel;

  @HostBinding('class') elementClass;

  constructor(private logger: LoggerService) {

  }

  public ngOnInit() {

    // this.logger.info('DynamicDatepickerComponent: ngOnInit()');
    this.elementClass = this.model.gridItemClass;
  }

}
