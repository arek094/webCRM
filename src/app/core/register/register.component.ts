import { Component, OnInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { uniqueEmailValidators } from 'src/app/shared/validators/unique-email-validators.directive';
import { UserService } from 'src/app/auth/user.service';
import { MatSnackBar } from '@angular/material';
import { uniqueUsernameValidators } from 'src/app/shared/validators/unique-username-validators.directive';
import { MatchPasswordValidator } from 'src/app/shared/validators/match-password-validators.directive';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeRouterService } from 'localize-router';
import { Router } from '@angular/router';
import { BusinessAgreementComponent } from '../business-agreement/business-agreement.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TechnicalBreakPolicyComponent } from '../business-agreement/technical-break-policy/technical-break-policy.component';
import { NgxSpinnerService } from 'ngx-spinner';

const httpOptions = {
  headers: new HttpHeaders({ 
  "Access-Control-Allow-Origin" : "*" 
  })}; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent  {

  formRegister:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private snackBarService: SnackBarService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {}
  

  ngOnInit() {
    this.buildForm();
  }

  registerUser(){
    if(this.formRegister.valid){
    this.spinner.show();
    this.authService.registerUser(this.formRegister.value)
    .subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
    }
  }

  private onSuccess(res){
    this.router.navigate(['/login'])
    this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
    this.spinner.hide();
  }

  private onFailure(res){
    this.buildForm();
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.spinner.hide();
  }


  private buildForm(){
    this.formRegister=this.formBuilder.group({
      imie: ['',[Validators.required]],
      nazwisko: ['',[Validators.required]],
      nazwa_uzytkownika: ['',[Validators.required,Validators.pattern("^[a-z0-9_-]{4,15}$")],uniqueUsernameValidators(this.userService)],
      haslo:['',[Validators.required,Validators.minLength(6)]],
      powtorzhaslo:['',[Validators.required,Validators.minLength(6)]],
      email: ['',[Validators.required,Validators.email],uniqueEmailValidators(this.userService)],
      firma:['',[Validators.required]],
      polityka_cookie:['',[Validators.required]],
      polityka_prywatnosci:['',[Validators.required]],
      polityka_przerw_dostepnosci:['',[Validators.required]],
      info_administratora:['',[Validators.required]],
      info_przetwarzania_danych:['',[Validators.required]],
      captcha: new FormControl(null, Validators.required),
      jezyk:[this.translate.getDefaultLang(),[]]
    }, {validator:MatchPasswordValidator('haslo','powtorzhaslo')}
    )}

    getErrorMessagePolicy() {
      return this.formRegister.get('polityka_cookie').hasError('required') ? '*Pole wymagane' :
      this.formRegister.get('polityka_prywatnosci').hasError('required') ? '*Pole wymagane' :
      this.formRegister.get('polityka_przerw_dostepnosci').hasError('required') ? '*Pole wymagane' :
      this.formRegister.get('info_administratora').hasError('required') ? '*Pole wymagane' :
      this.formRegister.get('info_przetwarzania_danych').hasError('required') ? '*Pole wymagane' :
      this.formRegister.get('captcha').hasError('required') ? '*Pole wymagane' :
          '';
    }


    getErrorMessageFirstname() {
      return this.formRegister.get('imie').hasError('required') ? 'Podaj imię' :
          '';
    }

    getErrorMessageLastname() {
      return this.formRegister.get('nazwisko').hasError('required') ? 'Podaj nazwisko' :
          '';
    }

    getErrorMessageUsername() {
      return this.formRegister.get('nazwa_uzytkownika').hasError('required') ? 'Podaj nazwę użytkownika' :
      this.formRegister.get('nazwa_uzytkownika').hasError('pattern') ? 'Podana nazwa użytkownika nie poprawna' :
      this.formRegister.get('nazwa_uzytkownika').hasError('uniqueUsername') ? 'Podana nazwa użytkownika już istnieje' :
          '';
    }

    getErrorMessagePassword() {
      return this.formRegister.get('haslo').hasError('required') ? 'Podaj hasło' :
      this.formRegister.get('haslo').hasError('minlength') ? 'Hasło powinno mieć minimum 6 znaków' :
          '';
    }

    getErrorMessageEmail() {
      return this.formRegister.get('email').hasError('required') ? 'Podaj adres e-mail' :
      this.formRegister.get('email').hasError('email') ? 'Podaj prawidłowy adres e-mail' :
      this.formRegister.get('email').hasError('uniqueEmail') ? 'Podany adres e-mail już istnieje' :
          '';
    }

    getErrorMessageFirma() {
      return this.formRegister.get('firma').hasError('required') ? 'Podaj firmę' :
          '';
    }

}
