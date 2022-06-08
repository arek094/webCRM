import { Directive } from '@angular/core';
import { UserService } from 'src/app/auth/user.service';
import { AsyncValidatorFn, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UniqueEmailValidatorsDirective } from './unique-email-validators.directive';


export function uniqueUsernameValidators(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl):  Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.getUserByUsername(control.value).pipe(
      map(res => {
        return res['data'].nazwa_uzytkownika && res['data'].nazwa_uzytkownika.length > 0 ? {'uniqueUsername': true} : null;
      })
    );
  };
}

@Directive({
  selector: '[uniqueUsername]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: UniqueEmailValidatorsDirective, multi:true }]
})
export class UniqueUsernameValidatorsDirective implements AsyncValidator {
  constructor(private userService: UserService) {  }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return uniqueUsernameValidators(this.userService)(control);
  }

}
