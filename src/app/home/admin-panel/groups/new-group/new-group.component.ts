import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { GroupsComponent } from '../groups.component';
import { GroupFormComponent } from '../group-form/group-form.component';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {
  @ViewChild('groupForm') groupForm: GroupFormComponent;
  
  constructor(
    public dialogRef: MatDialogRef<NewGroupComponent>,
    private adminPanelService: AdminPanelService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
  }

  newGroup(){
    if (this.groupForm.formGroups.valid){
    this.spinner.show()
    this.adminPanelService.insertGroup(this.groupForm.formGroups.value).subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
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
