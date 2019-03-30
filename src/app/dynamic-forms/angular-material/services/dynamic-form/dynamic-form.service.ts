import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';

import {Observable} from 'rxjs';

import {DynamicFormsConfig} from '../../../shared/models';
import {DynamicFormsConfigService} from '../../../services/config.service';

import {DynamicFormControlModel} from '../../models/dynamic-form-control.model';
import {DynamicFormModel} from '../../models/dynamic-form.model';
import {ValidatorModel} from '../../models/validator.model';
import {LoggerService} from '@app/utils/services/logger/logger.service';


export type ValidatorFactory = (args: any) => ValidatorFn;

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  private uriPrefix = 'assets/data/forms/';
  private uriSuffix = '.json';

  constructor(@Inject(DynamicFormsConfigService) private config: DynamicFormsConfig,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient,
              private logger: LoggerService) {

    this.uriPrefix = this.uriPrefix + this.config.defaultLanguage.split('-')[0] + '/';

    this.logger.info('DynamicFormService: uriPrefrix: ' + this.uriPrefix);
  }

  public getFormMetadata(formId: string): Observable<DynamicFormControlModel[]> {
    return this.httpClient.get<DynamicFormControlModel[]>(this.uriPrefix + formId + this.uriSuffix);
  }

  // https://angular.io/api/forms/FormControl

  public createGroup(formModel: DynamicFormModel): FormGroup {

    const group = this.formBuilder.group({});

    this.logger.info('DynamicFormService: createGroup()');

    formModel.forEach(controlModel => {

      const name = controlModel.id ? controlModel.id : controlModel.name;

      group.addControl(name, this.createControl(controlModel));
    });

    return group;
  }

  public createControl(controlModel: DynamicFormControlModel) {

    return this.formBuilder.control('', this.getValidators(controlModel.validators || []) );
  }

  public getValidators(validatorModel: ValidatorModel[]) {

    if (validatorModel.length === 0) {
      return null;
    }

    const functions: ValidatorFn[] = [];

    validatorModel.forEach(validator => {

      functions.push(this.getValidatorFn(validator.name, validator.args));
    });

    return Validators.compose(functions);

  }

  public getValidatorFn(validatorName: string, validatorArgs: any) {

    let validatorFn: ValidatorFn = null;

    //
    // Built-in validators: https://angular.io/guide/form-validation#built-in-validators
    //

    if (Validators.hasOwnProperty(validatorName) ) {

      validatorFn = (Validators as any)[validatorName];

      if (validatorArgs !== null) {
        validatorFn = (validatorFn as ValidatorFactory)(validatorArgs);
      }

      return validatorFn;

    }

  }

  public initGroup(formGroup: FormGroup, item): void {

    this.logger.info('DynamicFormService: initGroup()');

    for (const field of Object.keys(formGroup.controls)) {

      const property = this.getProperty(item, field);

      if (typeof property !== 'undefined') {
        formGroup.controls[field].setValue(property);
      }

    }

  }

  private getProperty = (obj, path) => (
    path.split('.').reduce((o, p) => o && o[p], obj)
  )

}
