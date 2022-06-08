import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { AccountSettingsService } from 'src/app/service/account-settings.service';
import { MatchPasswordValidator } from 'src/app/shared/validators/match-password-validators.directive';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  formChangePassword:FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private formBuilder: FormBuilder,
    private accountSettingsService: AccountSettingsService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.buildForm()
  }

  private onSuccess(res){
    this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
    this.dialogClose()
    this.spinner.hide()
  }

  private onFailure(res){
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.dialogClose()
    this.spinner.hide()
  }

  changePassword(){
    if(this.formChangePassword.valid){
    this.spinner.show()
    this.accountSettingsService.changePassword(this.formChangePassword.value)
    .subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
    }
  }

  dialogClose(){
    this.dialogRef.close();
  }

  private buildForm(){
    this.formChangePassword=this.formBuilder.group({
      stare_haslo: new FormControl('',[Validators.required]),
      nowe_haslo: new FormControl('',[Validators.required,Validators.minLength(6)]),
      powtorz_nowe_haslo : new FormControl('',[Validators.required,Validators.minLength(6)]),
    },{validator:MatchPasswordValidator('nowe_haslo','powtorz_nowe_haslo')})}


    getErrorMessageOldPassword() {
      return this.formChangePassword.get('stare_haslo').hasError('required') ? 'Podaj hasło' :
          '';
    }

    getErrorMessageNewPassword() {
      return this.formChangePassword.get('nowe_haslo').hasError('required') ? 'Podaj hasło' :
      this.formChangePassword.get('nowe_haslo').hasError('minlength') ? 'Hasło powinno mieć minimum 6 znaków' :
          '';
    }
}
