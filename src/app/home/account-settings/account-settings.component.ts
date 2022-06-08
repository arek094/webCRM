import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UserService } from 'src/app/auth/user.service';
import { User } from 'src/app/model/user';
import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { tap } from 'rxjs/operators';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  formUser:FormGroup;
  user: User;
  imie: string;
  nazwisko: string;
  kontrahent_nazwa: string;

  language  = [
    {value:'en', label:'Angielski',src:'././assets/images/icon-language/united-states.png'},
    {value:'pl',label:'Polski',src:'././assets/images/icon-language/poland.png'}
  ]
  
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private accountSettingsService: AccountSettingsService,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.buildForm()
    this.loadUser()
  }

  loadUser() {
    const uzytkownik_id  = this.route.snapshot.params['uzytkownik_id'];
    this.accountSettingsService.getUserAccount(uzytkownik_id).pipe(tap(user => this.formUser.patchValue(user['data']))).subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this));
    }

  saveEditUser(){
    this.spinner.show('actionSaveUser')
    this.accountSettingsService.updateUserAccount(this.formUser.value)
    .subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))    
  }

  buildForm(){
    this.formUser=this.formBuilder.group({
      imie: new FormControl('',[Validators.required]),
      nazwisko: new FormControl('',[Validators.required]),
      nazwa_uzytkownika: new FormControl('',[Validators.required]),
      firma: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required,Validators.email]),
      jezyk: new FormControl('',[Validators.required]),
    })}

    getErrorMessageFirstname() {
      return this.formUser.get('imie').hasError('required') ? 'Podaj imię' :
          '';
    }
  
    getErrorMessageLastname() {
      return this.formUser.get('nazwisko').hasError('required') ? 'Podaj nazwisko' :
          '';
    }
  
    getErrorMessageUsername() {
      return this.formUser.get('nazwa_uzytkownika').hasError('required') ? 'Podaj nazwę użytkownika' :
      this.formUser.get('nazwa_uzytkownika').hasError('uniqueUsername') ? 'Podana nazwa użytkownika już istnieje' :
          '';
    }
  
    getErrorMessagePassword() {
      return this.formUser.get('haslo').hasError('required') ? 'Podaj hasło' :
      this.formUser.get('haslo').hasError('minlength') ? 'Hasło powinno mieć minimum 6 znaków' :
          '';
    }
  
    getErrorMessageEmail() {
      return this.formUser.get('email').hasError('required') ? 'Podaj adres e-mail' :
      this.formUser.get('email').hasError('email') ? 'Podaj prawidłowy adres e-mail' :
      this.formUser.get('email').hasError('uniqueEmail') ? 'Podany adres e-mail już istnieje' :
          '';
    }
  
    getErrorMessageFirma() {
      return this.formUser.get('firma').hasError('required') ? 'Podaj firmę' :
          '';
    }

    private onSuccess(res){
      this.loadUser()
      this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")  
      this.spinner.hide("actionSaveUser")
    }
    
    private onFailure(res){
      this.loadUser()
      this.snackBarService.openSnackBar(res,"error","snackbar-error")
      this.spinner.hide("actionSaveUser")
    }

    private onSuccessList(res) {
      this.user = res;
      this.imie = this.user.imie;
      this.nazwisko = this.user.nazwisko;
      this.kontrahent_nazwa = this.user.kontrahent_nazwa;
    }
  
    private onFailureList(error) {
      console.log("Failure")
    }

}
