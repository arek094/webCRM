import { Component, OnInit, Output, EventEmitter, AfterContentInit, AfterContentChecked, AfterViewInit, DoCheck, OnChanges, SimpleChanges, Input, ViewChild } from '@angular/core';
import { UserGroup } from 'src/app/model/user-group';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { MatDialog, MatTableDataSource, MatDialogRef, MatPaginator } from '@angular/material';
import { GroupPermissionComponent } from './group-permission/group-permission.component';
import { NewGroupComponent } from './new-group/new-group.component';
import { EditGroupComponent } from './edit-group/edit-group.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['grupa_id','grupa_nazwa','funkcje'];
  dataSource: MatTableDataSource<UserGroup>;
  groups: UserGroup[];
  loading: boolean = true;

  constructor(
    private adminPanelService: AdminPanelService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.groups);  
   }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.refreshList()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  
  refreshList(){
    this.adminPanelService.getAdminPanelData(null,'t_grupy').subscribe(this.onSuccess.bind(this),this.onFailureList.bind(this))
  }
  

  openGroupDialogPermission(element){
    let dialogRef =  this.dialog.open(GroupPermissionComponent, {
       panelClass: 'matDialog',
       disableClose: true,
       data: element
     })
       dialogRef.afterClosed().subscribe(() => {
        this.refreshList()
       })}


  openNewGroup(){
    let dialogRef =  this.dialog.open(NewGroupComponent, {
        panelClass: 'matDialog',
        disableClose: true
      })
        dialogRef.afterClosed().subscribe(() => {
        this.refreshList()
        })}

  editGroupDialog(element){
    let dialogRef =  this.dialog.open(EditGroupComponent, {
       panelClass: 'matDialog',
       disableClose: true,
       data: element
     })
       dialogRef.afterClosed().subscribe(() => {
        this.refreshList()
       })
  }


  private onSuccess(res) {
    this.dataSource.data = res['data'];
    this.loading = false
  }

  private onFailureList(error) {
    console.log("Failure")
    this.loading = false
  }
}
