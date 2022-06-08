import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { GroupFormComponent } from '../group-form/group-form.component';
import { UserGroup } from 'src/app/model/user-group';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements AfterViewInit {
  @ViewChild('groupForm') groupForm: GroupFormComponent;
  
  constructor(
    public dialogRef: MatDialogRef<EditGroupComponent>,
    private adminPanelService: AdminPanelService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: UserGroup
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.groupForm.setGroup(this.data)
  }

  updateGroup(){
    this.spinner.show()
    this.adminPanelService.updateGroup(this.data.grupa_id,this.groupForm.formGroups.value).subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))  
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
