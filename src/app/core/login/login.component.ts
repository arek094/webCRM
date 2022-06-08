import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent   {

  formLogin:FormGroup;


  constructor(
    private authService: AuthService, 
    private snackBarService: SnackBarService,
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
    ) {  }


ngOnInit() {
  this.buildForm();
}

loginUser(){
  if (this.formLogin.valid){
  this.spinner.show();
  this.authService.loginUser(this.formLogin.value.login,this.formLogin.value.haslo).
  subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
  }
}


private buildForm(){
  this.formLogin=this.formBuilder.group({
    login: ['',[Validators.required]],
    haslo: ['',[Validators.required]],
  })}

getErrorMessageUsername() {
  return this.formLogin.get('login').hasError('required') ? this.translate.instant('LOGIN.TO_POLE_JEST_WYMAGANE'):
    '';
}


getErrorMessagePassword() {
  return this.formLogin.get('haslo').hasError('required') ? this.translate.instant('LOGIN.PODAJ_HASŁO')   :
    '';
}

private onSuccess(res){
  localStorage.setItem('token',res['token'])
  this.router.navigate([res['data'][0].url_po_zalogowaniu]) 
  this.spinner.hide();
}

private onFailure(res){
  this.snackBarService.openSnackBar(res,"error","snackbar-error")
  this.buildForm();
  this.spinner.hide();
}

goRegister(){
  this.router.navigate(['/register'])
}

goForgotPassword(){
  this.router.navigate(['/forgot-password'])
}


}
