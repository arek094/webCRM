import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../../model/order';
import { MatPaginator, MatTableDataSource, MatDialog, MatSnackBar, MatSort } from '@angular/material';
import { DetailsComponent } from '../details/details.component';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from 'src/app/auth/auth.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ReportsService } from 'src/app/service/reports.service';
import { OrderService } from 'src/app/service/order.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { ExcelService } from 'src/app/service/excel.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare let jsPDF;
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs; 
import * as moment from 'moment';



@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  
})
export class OrderListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('orderservice') orderservice: OrderService;

  userId: number = this.authService.userId()
  userDepot: boolean = this.authService.isUserDepot()
  displayedColumns: string[] = ['select','numer_zam','kontrahent_nazwa','status_nazwa','data_realizacji','data_realizacji_magazyn','data_utworzenia','uwagi','anulowany','functions'];
  dataSource: MatTableDataSource<Order>;
  selection = new SelectionModel<any>(true, []);
  orders: Order[] ;
  loading: boolean = true;
  check_ilosc_wydana: boolean = false

  constructor(
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    public authService: AuthService,
    public reportsService: ReportsService,
    private orderService: OrderService,
    private excelService:ExcelService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService) {
      this.dataSource = new MatTableDataSource(this.orders);
    }


  ngOnInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.refreshList();
  }

  refreshList(){
    this.orderService.getOrderMaterialData(1,'k_zam_nag_dost_lista').subscribe(this.onSuccessList.bind(this),this.onFailureList.bind(this))
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

 
  exportExcel(order){
    this.spinner.show("actionList") 
    this.orderService.getOrderMaterialData(order.zam_nag_dost_id,'k_zam_poz_dost_szczegoly').subscribe(
      (position) => {
        this.spinner.hide("actionList")
        this.excelService.exportAsExcelFile(position['data'] , order.numer_zam);
      },
      msg => {
        this.spinner.hide("actionList")
        console.log('Błąd podczas eksportu zamówienia.', msg);
      }
    );
  }

  

  removeOrder(order) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz usunąć zamówienie? ")
    .afterClosed().subscribe(res => { if (res)
    {
    this.spinner.show("actionList")  
    this.orderService.actionOrder(order.zam_nag_dost_id,6,this.userId)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }

  confirmOrderContractor(order) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz zatwierdzić zamówienie? ")
    .afterClosed().subscribe(res => { if (res)
    {
      this.spinner.show("actionList")  
      this.orderService.actionOrder(order.zam_nag_dost_id,1,this.userId)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }


  copyOrder(order) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz utowrzyć kopie zamówienia? ")
    .afterClosed().subscribe(res => { if (res)
    {
      this.spinner.show("actionList")  
      this.orderService.actionOrder(order.zam_nag_dost_id,5,this.userId)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }

  confirmOrderDepot(order) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz zatwierdzić zamówienie? ")
    .afterClosed().subscribe(res => { if (res)
    {
      this.spinner.show("actionList")  
      this.orderService.actionOrder(order.zam_nag_dost_id,2,this.userId)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }


  completedOrderDepot(order){
    this.orderService.getOrderMaterialData(order.zam_nag_dost_id,'k_zam_nag_dost_lista_k_zam_poz_dost_szczegoly').subscribe(
      (position) => {
        order = position['data'] 

        if(order.typ_dok_erp_id == null){
          this.snackBarService.openSnackBar("Uzupełnij typ dokumentu w zamówieniu "+ order.numer_zam +".","error","snackbar-error")
        } else {
          order.item.forEach(item => {
            if (item.ilosc_wydana == 0){
             this.check_ilosc_wydana = true}})
  
             if (this.check_ilosc_wydana == true){
              var message= "Zamówienie "+ order.numer_zam +"posiada pozycje z ilością wydana równą 0 "
            } else {message=""}
  
            this.dialogService.openConfirmDialog(message + "Czy na pewno chcesz zrealizować zamówienie? ")
            .afterClosed().subscribe(res => { if (res)
            {
              this.spinner.show("actionList")  
              this.orderService.actionOrder(order.zam_nag_dost_id,7,this.userId)
              .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
            } else {this.spinner.hide("actionList")}})
        }
      },
      msg => {
        console.log('Błąd podczas sprawdzania zamówienia', msg);
      }
    );
  }

  cancellOrder(order) {
    this.dialogService.openConfirmDialog("Czy na pewno chcesz anulować zamówienie? ")
    .afterClosed().subscribe(res => { if (res)
    {
    this.spinner.show("actionList")  
    this.orderService.actionOrder(order.zam_nag_dost_id,4,this.userId)
      .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
    }})
  }

  private onSuccess(data) {
    this.snackBarService.openSnackBar(data.message,"check_circle","snackbar-success")
    this.refreshList();
    this.spinner.hide("actionList")  
    this.selection.clear()
  }

  private onFailure(data) {
    this.snackBarService.openSnackBar(data.error.message,"error","snackbar-error")
    this.refreshList();
    this.spinner.hide("actionList")  
    this.selection.clear()
  }

  private onSuccessList(res) {
    this.dataSource.data = res['data'];
    this.loading = false;
    this.selection.clear()
  }

  private onFailureList(error) {
    console.log("Failure")
    this.selection.clear()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


showDetails(order){
  let dialogRef =  this.dialog.open(DetailsComponent, {
     panelClass: 'matDialog',
     data: {selectedOrder: order.zam_nag_dost_id, orderNag: order},
     minWidth: '80%',
     disableClose: false
   })
     dialogRef.afterClosed().subscribe(result => 
        this.refreshList()
  )}

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));   
}


removeOrderselect(){
  this.dialogService.openConfirmDialog("Czy na pewno chcesz usunąć zaznaczone zamówienia? ")
  .afterClosed().subscribe(res => { if (res)
  {
    this.spinner.show("actionList") 
    this.selection.selected.forEach(order => this.orderService.actionOrder(order.zam_nag_dost_id,6,this.userId)
    .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this)))
  }})
}


completedOrderselectDepot(){
  this.selection.selected.forEach(order =>
    this.orderService.getOrderMaterialData(order.zam_nag_dost_id,'k_zam_nag_dost_lista_k_zam_poz_dost_szczegoly').subscribe(
      (position) => {
        order = position['data'] 

        if(order.typ_dok_erp_id == null){
          this.snackBarService.openSnackBar("Uzupełnij typ dokumentu w zamówieniu "+ order.numer_zam +".","error","snackbar-error")
        } else {
          order.item.forEach(item => {
            if (item.ilosc_wydana == 0){
            this.check_ilosc_wydana = true}})

            if (this.check_ilosc_wydana == true){
              var message= "Zamówienie "+ order.numer_zam +" posiada pozycje z ilością wydana równą 0 " 
            } else {message=""}
            this.spinner.show("actionList")  
            this.dialogService.openConfirmDialog(message + " Czy na pewno chcesz zrealizować zamówienie? ")
            .afterClosed().subscribe(res => { if (res)
            {
              this.orderService.actionOrder(order.zam_nag_dost_id,7,this.userId)
              .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
            } else {this.spinner.hide("actionList")}})
        }
      },
      msg => {
        console.log('Błąd podczas sprawdzania zamówienia', msg);
      }
    ));
}

receivedOrderselect(){
  this.dialogService.openConfirmDialog("Czy na pewno chcesz oznaczyć zamówienie jako Zakończone (odebrane)? ")
  .afterClosed().subscribe(res => { if (res)
  {
    this.spinner.show("actionList") 
    this.selection.selected.forEach(order => this.orderService.actionOrder(order.zam_nag_dost_id,8,this.userId)
    .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this)))
  }})
}

confirmOrderselectContractor(){
  this.dialogService.openConfirmDialog("Czy na pewno chcesz zatwierdzić zaznaczone zamówienia? ")
  .afterClosed().subscribe(res => { if (res)
  {
    this.spinner.show("actionList") 
    this.selection.selected.forEach(order => this.orderService.actionOrder(order.zam_nag_dost_id,1,this.userId)
    .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this)))
  }})
}

confirmOrderselectDepot(){
  this.dialogService.openConfirmDialog("Czy na pewno chcesz zatwierdzić zaznaczone zamówienia? ")
  .afterClosed().subscribe(res => { if (res)
  {
    this.spinner.show("actionList") 
    this.selection.selected.forEach(order => this.orderService.actionOrder(order.zam_nag_dost_id,2,this.userId)
    .subscribe(this.onSuccess.bind(this), this.onFailure.bind(this)))
  }})
}

disableBtnDelete(order){
  if (order.status_id == 1) {
    return true;
  }
    else {
      return false
    }
}



disableBtnArchive(order){
  if ((order.anulowany == 'T') || (order.status_id != 2  && this.userDepot == false ) || (order.status_id != 3  && this.userDepot == true ))   {
    return false;
  }
    else {
      return true
    }
}

disableBtnConfirmContractor(order){
  if ((order.status_id != 1 || order.anulowany == 'T') && (this.userDepot == false)) {
    return false;
  }
    else {
      return true
    }
}

disableBtnConfirmDepot(order){
  if ((order.status_id != 2 || order.anulowany == 'T') && (this.userDepot == true)) {
    return false
  }
    else {
      return true
    }
}

disablecompletedOrderDepot(order){
  if ((order.status_id != 3  || order.anulowany == 'T') && (this.userDepot == true)) {
    return false
  }
    else {
      return true
    }
}

buildTableBody(data, columns, showHeaders, headers) {
  var body = [];
  // Inserting headers
  if(showHeaders) {
  body.push(headers);
  }
  
  // Inserting items from external data array
  data.forEach(function(row) {
      var dataRow = [];
      var i = 0;

      columns.forEach(function(column) {
          dataRow.push({text: row[column].toString(), alignment: headers[i].alignmentChild });
          i++;
      })
      body.push(dataRow);
     
  });

  return body;
}


downloadOrderMaterialPDF(element){ 
  this.spinner.show("actionList")
    this.orderService.getOrderMaterialData(element.zam_nag_dost_id,'k_zam_nag_dost_lista_k_zam_poz_dost_szczegoly').subscribe(
      (position) => {
        element = position['data']         

        const documentPDF = { 
          pageMargins: [ 40, 40, 40, 40 ],
          pageSize: 'A4',
          defaultStyle: {
            fontSize: 10,
          },
          header: [
            {
            style: 'header',
            columns: [
              { text: 'Wygenerowano dnia: '+ moment().format("YYYY-MM-DD") ,alignment: 'left'},
              { text: 'Numer zamówienia: ' + element.numer_zam,alignment: 'right'}
            ] 
          } 
          ],
          footer: function (currentPage, pageCount) {
            return {
                    style: 'footer',
                    columns: [
                        [
                          { text: 'Druk: crm.intertrend.pl',alignment: 'left'},
                        ],
                        [
                          { text: "Strona " + currentPage.toString() + ' z ' + pageCount, alignment: 'right', aligment: 'right' }
                        ]
                    ]
            };
        },
          content: [
          {
            style: 'zamowienie_naglowek',
            columns: [
              [
                { text: 'Numer zamówienia: ' + element.numer_zam},
                { text: 'Kontrahent: ' + element.kontrahent_nazwa},
                { text: 'Status: ' + element.status_nazwa},
                { text: 'Uwagi: ' + element.uwagi},
              ],
              [
                { text: 'Data realizacji: ' + element.data_realizacji},
                { text: 'Data realizacji magazyn: ' + element.data_realizacji_magazyn},
              ]
            ],
          },
            {text: 'POZYCJE', style: 'table_poz'},
            {
              table: {
                widths: [ '5%', '45%', '30%', '15%' ,'5%'],
                body: this.buildTableBody(element.item, ['nr_poz','wytwor_nazwa','wytwor_idm','ilosc_oczekiwana','jm_idn'],true,['LP','Nazwa produktu','Indeks produktu','Ilość oczekiwana','Jm']),
              }
            },      
          ],

          styles: {
            table_poz: {
              margin:[0,25,0,0],
              alignment: 'left'
            },
            header: {
              margin:[10,10,10,10],
            },
            footer: {
              margin:[10,10,10,10],
            },
            zamowienie_naglowek: {
              margin:[0,25,0,25],
              columnGap: 100
            }
          }
          
        }
        this.spinner.hide("actionList")
        pdfMake.createPdf(documentPDF).open();
      },
      msg => {
        this.spinner.hide("actionList")
        console.log('Błąd podczas generowania etykiet', msg);
      }
    );

    }



}


