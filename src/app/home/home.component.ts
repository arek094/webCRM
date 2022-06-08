import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { RegulationsComponent } from '../core/regulations/regulations.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  jwtHelper: JwtHelper = new JwtHelper();
  
  constructor(
    public authService: AuthService,
    public translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.translate.setDefaultLang(this.authService.user.jezyk)
    this.translate.use(this.authService.user.jezyk);
  }


  displayRegulations(){
    this.dialog.open(RegulationsComponent, {
      panelClass: 'matDialog',
      disableClose: true,
      maxWidth:'60%',
    })
  }

  delayDialog() {
    setTimeout (() => {
         this.displayRegulations()
      }, 1000); 
  }

  ngAfterViewInit(){
    if( (this.authService.user.dane_osobowe_panel_uzytk == null && this.authService.user.regulamin_panel_uzytk == null) 
              && (this.authService.permissionUser(22) == true || this.authService.permissionUser(23) == true || this.authService.permissionUser(24) == true ) ){
      this.delayDialog()
    }   
  }

}
