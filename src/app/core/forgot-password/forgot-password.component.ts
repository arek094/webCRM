import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  formForgotPassword:FormGroup;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
    
  ) { }

  ngOnInit() {
    this.buildForm()
  }

  private buildForm(){
    this.formForgotPassword=this.formBuilder.group({
      email: ['',[Validators.required,Validators.email]]
    })}


  forgotPassword(){
    if (this.formForgotPassword.valid){
    this.spinner.show()  
    this.authService.forgotPasssword(this.formForgotPassword.value.email).
    subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
    }
  }  


  private onSuccess(res){
    this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
    this.buildForm()
    this.spinner.hide()
    }
    
  private onFailure(res){
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.buildForm()  
    this.spinner.hide()
    }

  getErrorMessageEmail() {
    return this.formForgotPassword.get('email').hasError('required') ? 'Podaj adres e-mail' :
    this.formForgotPassword.get('email').hasError('email') ? 'Podaj prawidłowy adres e-mail' :
        '';
  }

  goRegister(){
    this.router.navigate(['/register'])
  }

  goLogin(){
    this.router.navigate(['/login'])
  }

}
