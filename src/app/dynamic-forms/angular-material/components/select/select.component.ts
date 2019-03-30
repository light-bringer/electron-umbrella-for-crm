import {Component, EventEmitter, HostBinding, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {DynamicFormControlCustomEvent, DynamicFormControlModel} from '../../models/dynamic-form-control.model';
import {LoggerService} from '@app/utils/services/logger/logger.service';

@Component({
  selector: 'dynamic-select',
  template: `
    <mat-form-field [appearance]="model.appearance"
                    [className]="model.gridItemClass"
                    [formGroup]="formGroup">

      <mat-label *ngIf="model.label"> {{ model.label }} </mat-label>

      <mat-select [placeholder]="model.label" [formControlName]="model.id">
        <mat-option *ngFor="let item of model.options" [value]="item">{{item}}</mat-option>
      </mat-select>

    </mat-form-field>
  `,
  styles: []
})
export class DynamicSelectComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() model: DynamicFormControlModel;
  @Output() customEvent = new EventEmitter<DynamicFormControlCustomEvent>();
  @HostBinding('class') elementClass;
  constructor(private logger: LoggerService) {
  }

  public ngOnInit() {
    this.elementClass = this.model.gridItemClass;
  }
}
