import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeliveryNoteService } from 'src/app/service/delivery-note.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-delivery-note-details-edit',
  templateUrl: './delivery-note-details-edit.component.html',
  styleUrls: ['./delivery-note-details-edit.component.scss']
})
export class DeliveryNoteDetailsEditComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['numer','numer_zam_poz','nr_poz','wytwor_idm','nazwa','ilosc','ilosc_potwierdzona'];

  constructor(
    private dialogRef: MatDialogRef<DeliveryNoteDetailsEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private deliveryNoteService: DeliveryNoteService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService,
    public formBuilder: FormBuilder
  ) {  }

  ngOnInit() {
    this.refreshList()  
  }


  refreshList(){
    this.deliveryNoteService.getDeliveryData(this.data,'k_wydanie_poz_dost_szczegoly').subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
  }

  addAllInput(){
    this.dataSource.data.forEach(element => {
      element['ilosc_potwierdzona'] = element['ilosc']
    });
  }

  editDeliveryNote(){
    this.spinner.show("actionList")
    this.deliveryNoteService.actionDeliveryNote(this.dataSource.data,3)
    .subscribe(this.onSuccessUpdate.bind(this),this.onFailureUpdate.bind(this))
  }

  private onSuccessUpdate(res){
    this.snackBarService.openSnackBar(res.message,"check_circle","snackbar-success")
    this.spinner.hide("actionList")
    this.dialogClose();
  }

  private onFailureUpdate(res){
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.spinner.hide("actionList")
    this.dialogClose();
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
