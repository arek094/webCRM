import { Component, OnInit, ViewChild } from '@angular/core';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { MatDialogRef } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  @ViewChild('userForm') userForm: UserFormDialogComponent;

  constructor(
    public dialogRef: MatDialogRef<NewUserComponent>,
    private adminPanelService: AdminPanelService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }


  newUser(){
    if (this.userForm.formUser.valid){
    this.spinner.show()
    this.adminPanelService.insertUser(this.userForm.formUser.value).subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
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
