import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotificationService } from 'src/app/service/notification.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { NotificationFormComponent } from '../notification-form/notification-form.component';

@Component({
  selector: 'app-notification-new',
  templateUrl: './notification-new.component.html',
  styleUrls: ['./notification-new.component.scss']
})
export class NotificationNewComponent implements OnInit {
  @ViewChild('notificationForm') notificationForm: NotificationFormComponent;

  constructor(
    public dialogRef: MatDialogRef<NotificationNewComponent>,
    private spinner: NgxSpinnerService,
    private notificationService: NotificationService,
    private snackBarService: SnackBarService,
  ) { }

  ngOnInit() {
  }


  dialogClose(){
    this.dialogRef.close();
  }

  newNotification(){
    if (this.notificationForm.formNotification.valid){
    this.spinner.show()
    this.notificationService.insertNotification(this.notificationForm.formNotification.value).subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
    }
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
