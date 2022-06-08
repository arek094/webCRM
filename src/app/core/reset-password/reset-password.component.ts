import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { MatchPasswordValidator } from 'src/app/shared/validators/match-password-validators.directive';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  formResetPassword:FormGroup;

  constructor(
    private route: ActivatedRoute,
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
    this.formResetPassword=this.formBuilder.group({
      haslo:['',[Validators.required,Validators.minLength(6)]],
      powtorzhaslo:['',[Validators.required,Validators.minLength(6)]],
    },{validator:MatchPasswordValidator('haslo','powtorzhaslo')}
    )}


  resetPassword(){
    const token  = this.route.snapshot.params['token'];
    const uzytkownik_id  = this.route.snapshot.params['uzytkownik_id'];

    if (this.formResetPassword.valid){
    this.spinner.show() 
    this.authService.resetPasssword(this.formResetPassword.value.haslo,token,uzytkownik_id).
    subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
    }
  }  

  getErrorMessagePassword() {
    return this.formResetPassword.get('haslo').hasError('required') ? 'Podaj hasło' :
    this.formResetPassword.get('haslo').hasError('minlength') ? 'Hasło powinno mieć minimum 6 znaków' :
        '';
  }


  private onSuccess(res){
    this.buildForm()
    this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
    this.spinner.hide()
    }
    
  private onFailure(res){
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.buildForm()
    this.spinner.hide()
    }

  goRegister(){
    this.router.navigate(['/register'])
  }

  goLogin(){
    this.router.navigate(['/login'])
  }


}
