import { Component, OnInit, Inject, Input } from '@angular/core';
import { User } from 'src/app/model/user';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { UserGroup } from 'src/app/model/user-group';
import { Contractor } from 'src/app/model/contractor';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { uniqueUsernameValidators } from 'src/app/shared/validators/unique-username-validators.directive';
import { uniqueEmailValidators } from 'src/app/shared/validators/unique-email-validators.directive';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss']
})
export class UserFormDialogComponent implements OnInit {
  @Input() editMode = false;
  formUser:FormGroup;
  userGroups: UserGroup[];
  contractors: Contractor[];
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toast: MatSnackBar,
    private adminPanelService: AdminPanelService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.buildForm()
    this.getUserGroup()
    this.getContractor()
  }

  ngAfterViewInit(){
    this.buildForm()
  }

getUserGroup(){
  this.adminPanelService.getAdminPanelData(null, 't_grupy').subscribe((value)  => {this.userGroups = value['data']},this.onFailureList.bind(this))
}

getContractor(){
  this.adminPanelService.getAdminPanelData(null,'t_kontrahenci').subscribe((value) => {this.contractors = value['data']},this.onFailureList.bind(this))
}

setUser(user: User){
  const {haslo,...formData} = user
  this.formUser.patchValue(formData)
}


private onFailureList(error) {
  console.log("Failure")
}

dialogClose(){
  this.dialogRef.close();
}

buildForm(){
  this.formUser=this.formBuilder.group({
    imie: new FormControl('',[Validators.required]),
    nazwisko: new FormControl('',[Validators.required]),
    nazwa_uzytkownika: new FormControl('',[Validators.required]),
    firma: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    grupa_id: new FormControl('',[]),
    kontrahent_id: new FormControl('',[]),
    haslo: new FormControl('',[]),
    czy_aktywny: new FormControl('',[]),
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


}
