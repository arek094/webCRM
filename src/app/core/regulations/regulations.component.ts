import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { RecipientComponent } from './recipient/recipient.component';
import { SupplierComponent } from './supplier/supplier.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-regulations',
  templateUrl: './regulations.component.html',
  styleUrls: ['./regulations.component.scss']
})
export class RegulationsComponent implements OnInit {

  @ViewChild("returnHtml", {read: ElementRef}) returnHtml: ElementRef;
  formRegulations:FormGroup;
  disableAnimation = true;
  panelOpenState_personal = false;
  panelOpenState_supplier = false;
  panelOpenState_recipient = false;

  constructor(
    public authService: AuthService,
    private dialogRef: MatDialogRef<RegulationsComponent>,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBarService: SnackBarService,
    public translate: TranslateService,
    public element: ElementRef,
    private spinner: NgxSpinnerService
  ) { 

    
  }

  ngOnInit() {
    this.buildForm()
    this.setRegulationValid()
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.disableAnimation = false);
  }


  private buildForm(){
    this.formRegulations=this.formBuilder.group({
      dane_osobowe_dodatkowe:['',[Validators.required]],
      regulamin_dodatkowy_dostawca:['',[Validators.required]],
      regulamin_dodatkowy_odbiorca:['',[Validators.required]],
    },)}

  notAkceptRegulations(){
    this.dialogRef.close()

    setTimeout (() => {
      this.authService.logout()
   }, 1000); 
    
  }

  setRegulationValid(){
    const dane_osobowe_dodatkoweControl = this.formRegulations.get('dane_osobowe_dodatkowe');
    const regulamin_dodatkowy_dostawcaControl = this.formRegulations.get('regulamin_dodatkowy_dostawca');
    const regulamin_dodatkowy_odbiorcaControl = this.formRegulations.get('regulamin_dodatkowy_odbiorca');

    

    if (this.authService.permissionUser(22) == false) {
      dane_osobowe_dodatkoweControl.setValidators(null);
    }
    if (this.authService.permissionUser(23) == false) {
      regulamin_dodatkowy_dostawcaControl.setValidators(null);
    }
    if (this.authService.permissionUser(24) == false) {
      regulamin_dodatkowy_odbiorcaControl.setValidators(null);
    }

    dane_osobowe_dodatkoweControl.updateValueAndValidity();
    regulamin_dodatkowy_dostawcaControl.updateValueAndValidity();
    regulamin_dodatkowy_odbiorcaControl.updateValueAndValidity();

  }


  akceptRegulations(){
    if(this.formRegulations.valid){
      this.spinner.show()
      this.authService.regulationsUser(this.formRegulations.value,this.authService.userId(),this.returnHtml.nativeElement.outerHTML)
     .subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
      }  
  }

  getErrorMessagePolicy() {
    return this.formRegulations.get('dane_osobowe_dodatkowe').hasError('required') ? '*Pole wymagane' :
    this.formRegulations.get('regulamin_dodatkowy_dostawca').hasError('required') ? '*Pole wymagane' :
    this.formRegulations.get('regulamin_dodatkowy_odbiorca').hasError('required') ? '*Pole wymagane' :
        '';
  }

  private onSuccess(res){
    this.dialogRef.close()
    this.spinner.hide()
  }

  private onFailure(res){
    this.authService.logout()
    this.spinner.hide()
  }

}
