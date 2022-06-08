import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatTabChangeEvent, MatDialogRef } from '@angular/material';
import { UserGroup } from 'src/app/model/user-group';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { ModuleAccess } from 'src/app/model/module';
import { ObjectAccess } from 'src/app/model/object-access';
import { FormControl } from '@angular/forms';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-group-permission',
  templateUrl: './group-permission.component.html',
  styleUrls: ['./group-permission.component.scss']
})
export class GroupPermissionComponent implements OnInit {

  modules: ModuleAccess[];
  permissions: Array<any>;
  modul_id : number;
  selectedOption;
  loading: boolean = true;

  constructor(
    private adminPanelService: AdminPanelService,
    private dialogRef: MatDialogRef<GroupPermissionComponent>,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: UserGroup
  ) { }

  ngOnInit() {
    this.getModule()
  }

  getModule(){
    this.adminPanelService.getAdminPanelData(this.data.grupa_id,'t_moduly_uprawnienia_obiekt_zapytanie').subscribe((value)  => {this.modules = value['data'],this.loading = false},this.onFailureList.bind(this))
  }

  onLinkClick(event: MatTabChangeEvent) {
    this.permissions = []
    this.modul_id = this.modules[event.index].modul_id
    this.modules[event.index]['item'].forEach(object_access => 
      {
        if(object_access.dostep == true) this.permissions.push(object_access.obiekt_id)
      }
      )
  }

  updateGroups(){
    this.spinner.show()
    this.adminPanelService.updateGroupPermision(this.data.grupa_id,this.modul_id,this.permissions)
    .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this))
  }

  onNgModelChange($event){
    this.selectedOption=$event;
  }

  dialogClose(){
    this.dialogRef.close();
  }

  private onFailureList(error) {
    console.log("Failure")
    this.loading = false
  }

  private onSuccess(data) {
    this.snackBarService.openSnackBar("Operacja wykonana pomyślnie.","check_circle","snackbar-success")
    this.getModule()
    this.spinner.hide()
  }

  private onFailure(data) {
    this.snackBarService.openSnackBar("Błąd podczas wykonywania operacji.","error","snackbar-error")
    this.spinner.hide()
  }

}
