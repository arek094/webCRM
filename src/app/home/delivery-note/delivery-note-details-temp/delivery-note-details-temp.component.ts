import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { componentNeedsResolution } from '@angular/core/src/metadata/resource_loading';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { DeliveryNoteService } from 'src/app/service/delivery-note.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-delivery-note-details-temp',
  templateUrl: './delivery-note-details-temp.component.html',
  styleUrls: ['./delivery-note-details-temp.component.scss']
})
export class DeliveryNoteDetailsTempComponent implements OnInit {
  
  @Input() editMode = false;
  formNumerObcy:FormGroup
  @ViewChild(MatSort) sort: MatSort;
  loading: boolean = true;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['numer','numer_zam_poz','wytwor_idm','nazwa','ilosc','funkcje'];


  constructor(
    private dialogRef: MatDialogRef<DeliveryNoteDetailsTempComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private deliveryNoteService: DeliveryNoteService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService,
    public formBuilder: FormBuilder,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.buildForm()
    this.refreshList()
  }

  saveInformationNag(){
    var data = {wydanie_nag_id: this.data, numer_obcy: this.formNumerObcy.controls["numerwzobcy"].value}
    this.spinner.show("actionList") 
    this.deliveryNoteService.actionDeliveryNote(data,5)
    .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this))
  }

  buildForm(){
    this.formNumerObcy=this.formBuilder.group({
      numerwzobcy: new FormControl('',),
    })}

  refreshList(){
    this.deliveryNoteService.getDeliveryData(this.data,'t_wydanie_nag_dost_temp_k_wydanie_poz_dost_temp_szczegoly').subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
  }

  deletePosition(deliveryNoteTempPoz) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz usunąć pozycje? ")
    .afterClosed().subscribe(res => { if (res)
    { 
      this.deliveryNoteService.actionDeliveryNote(deliveryNoteTempPoz.zam_poz_dost_id,1)
      .subscribe(this.onSuccessDel.bind(this), this.onFailureDel.bind(this));
    }})
  }

  confirmationNote() {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz zatwierdzić wydanie? ")
    .afterClosed().subscribe(res => { if (res)
    { 
      this.spinner.show("actionList") 
      this.deliveryNoteService.actionDeliveryNote(this.data,2)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }

  private onSuccessDel(data) {
    this.snackBarService.openSnackBar(data.message,"check_circle","snackbar-success")
    this.refreshList();
    this.spinner.hide("actionList") 

  }

  private onFailureDel(data) {
    this.snackBarService.openSnackBar(data.error.message,"error","snackbar-error")
    this.refreshList();
    this.spinner.hide("actionList")  
  }


  private onSuccess(data) {
    this.snackBarService.openSnackBar(data.message,"check_circle","snackbar-success")
    this.refreshList();
    this.spinner.hide("actionList") 
    this.dialogClose() 

  }

  private onFailure(data) {
    this.snackBarService.openSnackBar(data.error.message,"error","snackbar-error")
    this.refreshList();
    this.spinner.hide("actionList")  
    this.dialogClose() 
  }

  private onSuccessList(res) {
    this.dataSource = new MatTableDataSource(res['data']['item']);
    this.formNumerObcy.controls.numerwzobcy.setValue(res['data'].numer_wz_obcy);
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
