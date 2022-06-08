import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/model/user';
import { MatDialog } from '@angular/material';
import { HelpMessageComponent } from 'src/app/core/help-message/help-message.component';
import { Observable } from 'rxjs';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private router: Router,
    public authService: AuthService,
    private dialog: MatDialog
    ) { }

  ngOnInit() {
  }

  private onSuccess(res){

  }
  
  private onFailure(res){

  }


  toAccountSetting(){
    this.router.navigate(['/account-settings',this.authService.userId()]);
  }

  toHelpPanel(){
    this.router.navigate(['/help-panel']);
  }



}
