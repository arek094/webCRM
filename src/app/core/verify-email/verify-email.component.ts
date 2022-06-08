import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { AuthService } from 'src/app/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.verifyEmail()
    }

  verifyEmail(){
    const token  = this.route.snapshot.params['token'];
    const uzytkownik_id  = this.route.snapshot.params['uzytkownik_id'];

    this.authService.verifyEmail(token,uzytkownik_id).
    subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
    
  }

  private onSuccess(res){
    this.router.navigate(['/login'])
    this.snackBarService.openSnackBar(this.translate.instant(res),"check_circle","snackbar-success")
    }
    
  private onFailure(res){
    this.router.navigate(['/login'])
    this.snackBarService.openSnackBar(this.translate.instant(res),"error","snackbar-error")
    }

}
