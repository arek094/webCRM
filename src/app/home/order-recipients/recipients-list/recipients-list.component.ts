import { animate, AnimationKeyframesSequenceMetadata, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { Order } from 'src/app/model/order';
import { ExcelService } from 'src/app/service/excel.service';
import { OrderRecipientsService } from 'src/app/service/order-recipients.service';
import { OrderService } from 'src/app/service/order.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { Observable, of } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-recipients-list',
  templateUrl: './recipients-list.component.html',
  styleUrls: ['./recipients-list.component.scss'],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class RecipientsListComponent implements OnInit {

  //displayedColumns: string[] = ['select','nr_zam_odbiorca', 'nr_zam_platnik', 'data_zam', 'data_wprowadzenia',  'nr_zam_crm' ,'anulowany'];
  dataSource: MatTableDataSource<any>;
  dataSourcePoz: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  columnsToDisplay = [ "nr_zam"  , "data_zam" , "data_wprowadzenia", "nr_zam_crm", "anulowany"];
  expandDisplayedColumns = ["nazwa" , "kod_artykulu","ilosc", "ilosc_plan" ,  "data_wysylki_plan", "anulowany" , "ilosc_wyslana","cena" ,"waluta", "eany"];
  expandedElement: any | null;
  loading: boolean = true;
  loading_nag: boolean = true;

  constructor(
    //public translate: TranslateService,
    private OrderRecipientsService: OrderRecipientsService,
    private toast: MatSnackBar,
    public authService: AuthService,
   // private orderService: OrderService,
    private dialog: MatDialog,
    private excelService:ExcelService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService
    ) {

     
    }

  ngOnInit() {
    this.refreshList()
  }


  refreshList(){
    this.OrderRecipientsService.getOrderRecipientsData(3,'k_zam_nag_odb').subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
  }

  private onSuccess(res) {
    console.log(res['data'])
    this.dataSource = new MatTableDataSource(res['data']);
    this.loading_nag = false;
    
    //this.loading = false;
   
  }

  private onFailure(error) {
    console.log(error)
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  napelnij(element){
    this.loading = true;
    this.dataSourcePoz = new MatTableDataSource([]);
       this.OrderRecipientsService.getOrderRecipientsData(element.zam_nag_odb_id,'k_zam_poz_odb').subscribe(this.onSuccessPoz.bind(this),this.onFailurePoz.bind(this))
   
  }

  private onSuccessPoz(res) {
   
    this.dataSourcePoz = new MatTableDataSource(res['data']);
    //console.log(res)
    this.loading = false;
    }

  private onFailurePoz(error) {
    console.log(error)
  }
}

/*
export class ExampleDataSource extends DataSource<any> {

  connect(): Observable<Element[]> {
    const rows = [];
    this.dataSource.data.forEach(element => rows.push(element, { detailRow: true, element }));
    console.log(rows);
    return of(rows);
  }

  disconnect() { }
}
*/