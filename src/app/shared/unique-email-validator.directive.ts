import { Directive } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Directive({
  selector: '[uniqueEmail]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: UniqueEmailValidatorDirective,
    multi: true
  }]
})
export class UniqueEmailValidatorDirective implements AsyncValidator {

  constructor(
    private userService: UserService
  ) { }

  validate(control: AbstractControl<any, any>): Promise<ValidationErrors> | Observable<ValidationErrors> {
    return this.userService.checkEmailExists(control.value).pipe(
      map(result => {
        return result ? {'uniqueEmail': true} : null;
      })
    )
  }

}
