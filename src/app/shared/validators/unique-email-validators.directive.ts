import { Directive } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { AbstractControl, ValidationErrors, AsyncValidator, NG_ASYNC_VALIDATORS, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



export function uniqueEmailValidators(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl):  Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.getUserByEmail(control.value).pipe(
      map(res => {
        return res['data'].email && res['data'].email.length > 0 ? {'uniqueEmail': true} : null;
      })
    );
  };
}

@Directive({
  selector: '[uniqueEmail]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniqueEmailValidatorsDirective, multi:true }]
})
export class UniqueEmailValidatorsDirective implements AsyncValidator {
  constructor(private userService: UserService) {  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return uniqueEmailValidators(this.userService)(control);
  }
} 