import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeliveryNoteService } from 'src/app/service/delivery-note.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-delivery-note-details',
  templateUrl: './delivery-note-details.component.html',
  styleUrls: ['./delivery-note-details.component.scss']
})
export class DeliveryNoteDetailsComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['numer','numer_zam_poz','nr_poz','wytwor_idm','nazwa','ilosc','ilosc_potwierdzona'];

  constructor(
    private dialogRef: MatDialogRef<DeliveryNoteDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private deliveryNoteService: DeliveryNoteService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.refreshList()
  }

  refreshList(){
    this.deliveryNoteService.getDeliveryData(this.data,'k_wydanie_poz_dost_szczegoly').subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
  }

  private onSuccessList(res) {
    this.dataSource = new MatTableDataSource(res['data']);
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  private onFailureList(error) {
    this.loading = false;
    console.log("Failure")
  }

  dialogClose(){
    this.dialogRef.close();
  }

}
