import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { Order } from 'src/app/model/order';
import { OrderItem } from 'src/app/model/order-item';
import { OrderSupplierService } from 'src/app/service/order-supplier.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { SupplierDetailsComponent } from '../supplier-details/supplier-details.component';

@Component({
  selector: 'app-generate-delivery-note',
  templateUrl: './generate-delivery-note.component.html',
  styleUrls: ['./generate-delivery-note.component.scss']
})
export class GenerateDeliveryNoteComponent implements OnInit  {

  formIloscWydana:FormGroup
  loading: boolean = true;
  checkValidIlosc = []
  order: Order
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = ['numer_zam', 'uwagi_poz','nr_poz', 'wytwor_idm','wytwor_nazwa','ilosc_oczekiwana','ilosc_wydana','funkcje'];
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private dialogRef: MatDialogRef<SupplierDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private orderSupplierService: OrderSupplierService,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService,
    public formBuilder: FormBuilder
  ) { }


  refreshList(){
    this.orderSupplierService.getOrderSupplierData(this.data,'wydanie_poz_dost_zam_poz').subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
  }

  ngOnInit(){
    this.refreshList()
  }


  deletePosition(element){
    this.dataSource.data.splice(this.dataSource.data.indexOf(element),1);
    this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
  }

  selectAll(){
      this.dataSource.filteredData.forEach(element => {
        element["ilosc_wydana"] = element["ilosc_oczekiwana"]
      });
  }

  generateTempNote(){
    this.dataSource.data.forEach(element => {
      if ((element["ilosc_wydana"] > element["ilosc_oczekiwana"]) || (element["ilosc_wydana"] < 0)){
        this.checkValidIlosc.push(true)
      } else {
        this.checkValidIlosc.push(false)
    }})
 
    if (!this.checkValidIlosc.includes(true)){
    this.spinner.show("actionList")
    this.orderSupplierService.insertTempDelivery(this.dataSource.data)
    .subscribe(this.onSuccessInsert.bind(this),this.onFailureInsert.bind(this))
   } else {
    this.snackBarService.openSnackBar('Istnieją błedy w ilości wydanej.',"error","snackbar-error")
   }
   this.checkValidIlosc = []
  }

  private onSuccessInsert(res){
    this.snackBarService.openSnackBar(res,"check_circle","snackbar-success")
    this.spinner.hide("actionList")
    this.dialogClose()
  }

  private onFailureInsert(res){
    this.snackBarService.openSnackBar(res,"error","snackbar-error")
    this.spinner.hide("actionList")
    this.dialogClose()
  }


  private onSuccess(res) {
    this.dataSource = new MatTableDataSource(res['data']);
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  private onFailure(error) {
    this.dialogClose()
    this.snackBarService.openSnackBar(error,"error","snackbar-error")
  }

  dialogClose(){
    this.dialogRef.close();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }


}
