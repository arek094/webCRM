import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/model/user';
import { MatTableDataSource, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { AdminPanelService } from 'src/app/service/admin-panel.service';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['nazwa_uzytkownika','firma','grupa_nazwa','czy_aktywny','funkcje'];
  dataSource: MatTableDataSource<User>;
  users: User[];
  loading: boolean = true;

  constructor(
    private adminPanelService: AdminPanelService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource(this.users);
   }

   ngOnInit() {
    this.refreshList()
  }

  
  refreshList(){
    this.adminPanelService.getAdminPanelData(null,'k_uzytkownicy_szczegoly').subscribe(this.onSuccess.bind(this),this.onFailureList.bind(this))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


openEditUser(element){
  let dialogRef =  this.dialog.open(EditUserComponent, {
     panelClass: 'matDialog',
     maxWidth: '800px',
     disableClose: true,
     data: element
   })
     dialogRef.afterClosed().subscribe(() => {
      this.refreshList()
     })}


openNewUser(){
  let dialogRef =  this.dialog.open(NewUserComponent, {
      panelClass: 'matDialog',
      disableClose: true,
      maxWidth: '800px'
    })
      dialogRef.afterClosed().subscribe(() => {
        this.refreshList()
      })}

  private onSuccess(res) {
    this.dataSource.data = res['data'];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false
  }

  private onFailureList(error) {
    console.log("Failure")
    this.loading = false
  }

}


 