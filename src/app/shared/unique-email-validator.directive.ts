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
    return this.userService.getUserByEmail(control.value).pipe(
      map(users => {
        return users && users.length > 0 ? {'uniqueEmail': true} : null;
      })
    )
  }

}
