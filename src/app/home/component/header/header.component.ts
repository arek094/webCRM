import { Component, OnInit, AfterContentInit } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { HelpMessageComponent } from 'src/app/core/help-message/help-message.component';
import { MatDialog } from '@angular/material';
import { ChangePasswordComponent } from 'src/app/core/change-password/change-password.component';
import { TranslateService } from '@ngx-translate/core';
import { JwtHelper } from 'angular2-jwt';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  user: User
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public translate: TranslateService
    ) { }


  ngOnInit() {
  }


  toAccountSetting(){
    this.router.navigate(['/account-settings',this.authService.userId()]);
  }
  
  toHelpPanel(){
    this.router.navigate(['/help-panel']);
  }

  helpMessage(){
    this.dialog.open(HelpMessageComponent, {
      panelClass: 'matDialog',
      disableClose: false
    })
  }

  changePassword(){
    this.dialog.open(ChangePasswordComponent, {
      panelClass: 'matDialog',
      disableClose: false
    })
  }

}
