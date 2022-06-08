import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { User } from 'src/app/model/user';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements AfterViewInit {
  @ViewChild('userForm') userForm: UserFormDialogComponent;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private adminPanelService: AdminPanelService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.userForm.setUser(this.data)
      this.userForm.formUser.get('czy_aktywny').setValue(this.data.czy_aktywny == true ? true : this.data.czy_aktywny == false ? false : null)
  });

  }

  updateUser(){
    if (this.userForm.formUser.valid){
    this.spinner.show()
    this.adminPanelService.updateUser(this.data.uzytkownik_id,this.userForm.formUser.value).subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
      }
  }

  dialogClose(){
    this.dialogRef.close();
  }

  private onSuccess(res){
    this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
    this.dialogRef.close();
    this.spinner.hide()
  }

  private onFailure(res){
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.dialogRef.close();
    this.spinner.hide()
  }

}
