import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { NotificationService } from 'src/app/service/notification.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { NotificationNewComponent } from './notification-new/notification-new.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['numer','status_nazwa','uzytkownik_utworzenia','kontrahent_nazwa','temat_zgloszenia','opis_zgloszenia','telefon_kontaktowy','uzytkownik_realizujacy','data_utworzenia','functions'];
  dataSource: MatTableDataSource<any>;
  loading: boolean = true;


  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    public authService: AuthService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.refreshList()
  }

  refreshList(){
    this.notificationService.getNotificationData(null,'k_zgloszenia').subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
  }


  private onFailureList(error) {
    console.log(error)
    this.loading = false
  }

  private onSuccessList(res) {
    this.dataSource = new MatTableDataSource(res['data']);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  changeStatusWTR(element) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz zmienić status zgłoszenia? ")
    .afterClosed().subscribe(res => { if (res)
    {
      this.spinner.show("actionList")  
      this.notificationService.actionNotification(element.zgloszenie_id,1)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }

  changeStatusZ(element) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz zmienić status zgłoszenia? ")
    .afterClosed().subscribe(res => { if (res)
    {
      this.spinner.show("actionList")  
      this.notificationService.actionNotification(element.zgloszenie_id,2)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }

  cancelNotification(element) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz anulować zamówienie? ")
    .afterClosed().subscribe(res => { if (res)
    {
      this.spinner.show("actionList")  
      this.notificationService.actionNotification(element.zgloszenie_id,3)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }

  private onSuccess(data) {
    this.snackBarService.openSnackBar(data.message,"check_circle","snackbar-success")
    this.refreshList();
    this.spinner.hide("actionList")  
  }

  private onFailure(data) {
    this.snackBarService.openSnackBar(data,"error","snackbar-error")
    this.refreshList();
    this.spinner.hide("actionList")  
  }


  newNotification(){
    let dialogRef =  this.dialog.open(NotificationNewComponent, {
        panelClass: 'matDialog',
        disableClose: true,
        width: '80%'
      })
        dialogRef.afterClosed().subscribe(() => {
          this.refreshList()
        })}

}
