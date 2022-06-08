import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/auth.service';
import { DeliveryNoteService } from 'src/app/service/delivery-note.service';
import { OrderSupplierService } from 'src/app/service/order-supplier.service';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { DeliveryNoteDetailsTempComponent } from '../delivery-note-details-temp/delivery-note-details-temp.component';
import { DeliveryNoteDetailsComponent } from '../delivery-note-details/delivery-note-details.component';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs; 
import * as moment from 'moment';
import { DeliveryNoteDetailsEditComponent } from '../delivery-note-details-edit/delivery-note-details-edit.component';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'src/app/service/excel.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { SelectionModel } from '@angular/cdk/collections';


declare let JsBarcode: any;

@Component({
  selector: 'app-delivery-note-list',
  templateUrl: './delivery-note-list.component.html',
  styleUrls: ['./delivery-note-list.component.scss']
})
export class DeliveryNoteListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumnsNoteTemp: string[] = ['wydanie_nag_dost_id','numer','data_utworzenia'];
  dataSourceNoteTemp: MatTableDataSource<any>;

  displayedColumnsNote: string[] = ['select','wydanie_nag_dost_id','numer','status_nazwa','kontrahent_nazwa','data_utworzenia','funkcje'];
  dataSourceNote: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  loadingNote: boolean = true;
  loadingTemp: boolean = true;
  checkIloscPotwierdzona: Number[] = [];
  order_item_TURA = []
  selectedDelivery = []

  constructor(
    private dialog: MatDialog,
    private deliveryNoteService: DeliveryNoteService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    public authService: AuthService,
    private spinner: NgxSpinnerService,
    private excelService:ExcelService
  ) { }


  ngOnInit() {
    this.refreshListNote()
    this.refreshListTemp()
  }

  refreshListTemp(){
    this.deliveryNoteService.getDeliveryData(null,'t_wydanie_nag_dost_temp').subscribe(this.onSuccessListTemp.bind(this),this.onFailureListTemp.bind(this))
  }

  refreshListNote(){
    this.deliveryNoteService.getDeliveryData(null,'t_wydanie_nag_dost').subscribe(this.onSuccessListNote.bind(this),this.onFailureListNote.bind(this))
  }


  exportExcel(element){
    this.spinner.show("actionList") 
    this.deliveryNoteService.getDeliveryData(element.wydanie_nag_dost_id,'k_wydanie_poz_dost_szczegoly').subscribe(
      (position) => {
        this.spinner.hide("actionList")
        console.log(position)
        this.excelService.exportAsExcelFile(position['data'] , element.numer);
      },
      msg => {
        this.spinner.hide("actionList")
        console.log('Błąd podczas eksportu zamówienia.', msg);
      }
    );
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceNote.data.forEach(row => this.selection.select(row));
  }


  isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSourceNote.data.length;
      return numSelected === numRows;
    }

    exportCSVSelected(){
      if (this.selection.selected.length == 0) {
        this.snackBarService.openSnackBar('Nie wybrałeś żadnej pozycji.',"error","snackbar-error")
      } else {
        this.selection.selected.forEach(result => this.selectedDelivery.push(result.wydanie_nag_dost_id))
        this.spinner.show("actionList")
        this.deliveryNoteService.getDeliveryData(this.selectedDelivery,'k_wydanie_eksport_csvIN').subscribe(
          (position) => {
            this.spinner.hide("actionList")
    
            var options = { 
              fieldSeparator: ';',
              quoteStrings: '',
              decimalseparator: '.',
              showLabels: false, 
              showTitle: false,
              title: '',
              useBom: true,
              noDownload: false,
              headers: [],
              useHeader: false,
              nullToEmptyString: true,
            };
    
            new AngularCsv(position['data'], "CSV" + moment().format("YYYY-MM-DD"), options);
          },
          msg => {
            this.spinner.hide("actionList")
            console.log('Błąd podczas eksportu zamówienia.', msg);
          }
        );
        
      }
    }  


  exportCSV(element){
    this.spinner.show("actionList")
    this.deliveryNoteService.getDeliveryData(element.wydanie_nag_dost_id,'k_wydanie_eksport_csv').subscribe(
      (position) => {
        this.spinner.hide("actionList")

        var options = { 
          fieldSeparator: ';',
          quoteStrings: '',
          decimalseparator: '.',
          showLabels: false, 
          showTitle: false,
          title: '',
          useBom: true,
          noDownload: false,
          headers: [],
          useHeader: false,
          nullToEmptyString: true,
        };

        new AngularCsv(position['data'], element.numer, options);
      },
      msg => {
        this.spinner.hide("actionList")
        console.log('Błąd podczas eksportu zamówienia.', msg);
      }
    );
  }

  private onFailureListTemp(error) {
    this.dataSourceNoteTemp = new MatTableDataSource();
    this.loadingTemp = false;
    console.log(error)
  }

  private onSuccessListTemp(res) {
    this.dataSourceNoteTemp = new MatTableDataSource(res['data']);
    this.loadingTemp = false;
  }

  private onFailureListNote(error) {
    this.dataSourceNote = new MatTableDataSource();
    this.loadingNote = false;
    console.log(error)
  }

  applyFilter(filterValue: string) {
    this.dataSourceNote.filter = filterValue.trim().toLowerCase();
  }

  private onSuccessListNote(res) {
    this.dataSourceNote = new MatTableDataSource(res['data']);
    this.dataSourceNote.paginator = this.paginator;
    this.dataSourceNote.sort = this.sort;
    this.loadingNote = false;
  }


  showDetailsTemp(deliveryTemp){
    let dialogRef =  this.dialog.open(DeliveryNoteDetailsTempComponent, {
       panelClass: 'matDialog',
       data:deliveryTemp.wydanie_nag_dost_id,
       minWidth: '80%',
       disableClose: true
     })
       dialogRef.afterClosed().subscribe(result => {
        this.refreshListNote()
        this.refreshListTemp()
       } 
    )}


    
  showDetails(delivery){
    let dialogRef =  this.dialog.open(DeliveryNoteDetailsComponent, {
       panelClass: 'matDialog',
       data:delivery.wydanie_nag_dost_id,
       minWidth: '80%',
       disableClose: true
     })
       dialogRef.afterClosed().subscribe(result => {
        this.refreshListNote()
        this.refreshListTemp()
       } 
    )}

    editDelivery(delivery){
      if(delivery.status_id == 1){
        let dialogRef =  this.dialog.open(DeliveryNoteDetailsEditComponent, {
          panelClass: 'matDialog',
          data:delivery.wydanie_nag_dost_id,
          minWidth: '80%',
          disableClose: true
        })
          dialogRef.afterClosed().subscribe(result => {
          this.refreshListNote()
          this.refreshListTemp()
          })
      }  else {
        this.snackBarService.openSnackBar("Wydanie "+ delivery.numer +" jest już zatwierdzone, brak możliwości edycji.","error","snackbar-error")
      }
    }


    confirmDelivery(delivery){
      this.spinner.show("actionList")
      this.deliveryNoteService.getDeliveryData(delivery.wydanie_nag_dost_id,'k_wydanie_nag_raport_k_wydanie_poz_raport').subscribe(
        (position) => {
          delivery = position['data'] 

          delivery.item.forEach(item => {
            this.checkIloscPotwierdzona.push(item.ilosc_potwierdzona)})
          const found = this.checkIloscPotwierdzona.find(element => element == 0);

          if(delivery.status_id == 2){
            this.snackBarService.openSnackBar("Wydanie "+ delivery.numer +" jest już zatwierdzone.","error","snackbar-error")
            this.spinner.hide("actionList")
          } else {
            if (found == 0 ) {var message= "Wydanie "+ delivery.numer +" posiada pozycje z ilością potwierdzoną równą 0 "} else {var message = ""}

            this.dialogService.openConfirmDialog(message + "Czy na pewno chcesz zatwierdzić wydanie? ")
            .afterClosed().subscribe(res => { if (res)
            { 
              this.deliveryNoteService.actionDeliveryNote(delivery.wydanie_nag_dost_id,4).subscribe(this.onSuccess.bind(this), this.onFailure.bind(this));
            } else {this.spinner.hide("actionList")}})
          }         
          this.checkIloscPotwierdzona = [];
        },
        msg => {
          console.log('Błąd podczas sprawdzania zamówienia', msg);
        }
      );

    }

    private onSuccess(res) {
      this.snackBarService.openSnackBar(res.message,"check_circle","snackbar-success")
      this.refreshListNote()
      this.spinner.hide("actionList") 
  
    }
  
    private onFailure(res) {
      this.snackBarService.openSnackBar(res.error.message,"error","snackbar-error")
      this.refreshListNote()
      this.spinner.hide("actionList")  
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

  downloadNotePDF(element){ 
    this.spinner.show("actionList")
      this.deliveryNoteService.getDeliveryData(element.wydanie_nag_dost_id,'k_wydanie_nag_raport_k_wydanie_poz_raport_beztury').subscribe(
        (position) => {
          element = position['data']         

          const documentPDF = { 
            pageMargins: [ 40, 40, 40, 40 ],
            pageSize: 'A4',
            defaultStyle: {
              fontSize: 8,
            },
            header: [
              {
              style: 'header',
              columns: [
                { text: 'Wydanie zewnętrzne nr ' + element.numer + '\n' + 'Numer WZ obcy ' + element.numer_wz_obcy ,alignment: 'left'},
                { text: 'Wystawiono dnia: '+ moment().format("YYYY-MM-DD") ,alignment: 'right'}
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
              style: 'odbiorca_sprzedawca',
              columns: [
                [
                  {text: 'Dostawca: '},
                  {text: element.kontrahent_nazwa},
                  {text: element.kontrahent_ulica_nr},
                  {text: element.kontrahent_kod_pocztowy + element.kontrahent_miasto},
                  {text: 'NIP: ' + element.nip},
                  {text: element.kontrahent_email}
                ],
                [
                  {text: 'Odbiorca: '},
                  {text: 'Intertrend Polska Sp. z o.o.'},
                  {text: '62-300 Września'},
                  {text: 'NIP: 5262789617'},
                  {text: 'biuro@intertrend.pl'}
                ]
              ],
            },
              {text: 'POZYCJE', style: 'table_poz'},
              {
                layout: 'lightHorizontalLines',
                table: {
                  widths: [20, '*', 'auto', 80, '*' ],
                  body: this.buildTableBody(element.item, ['lp','numer_zam','nazwa','wytwor_idm','ilosc'],true,['Lp.','Numer zamówienia','Nazwa produktu','Indeks produktu','Ilość']),
                }
              },
              {
                style: 'wystawil_odebral',
                columns: [
                  [
                    {text: '...................................'},
                    {text: '(Wystawił)'},
                  ],
                  [
                    {text: '...................................'},
                    {text: '(Odebrał)'},
                  ]
                ],
              }
        
            ]  ,

            styles: {
              table_poz: {
                margin:[0,25,0,0],
                alignment: 'left'
              },
              header: {
                margin:[25,10,25,10],
                fontSize: 10
              },
              footer: {
                margin:[10,10,10,10],
              },
              odbiorca_sprzedawca: {
                margin:[0,25,0,25],
                columnGap: 100,
                fontSize: 10
              },
              wystawil_odebral: {
                margin:[0,50,0,0],
                alignment: 'center',
                fontSize: 10
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



    downloadNotePDFTura(element){ 
      this.spinner.show("actionList")
        this.deliveryNoteService.getDeliveryData(element.wydanie_nag_dost_id,'k_wydanie_nag_raport_k_wydanie_poz_raport').subscribe(
          (position) => {
            element = position['data']         

            const documentPDF = { 
              pageMargins: [ 40, 40, 40, 40 ],
              pageSize: 'A4',
              defaultStyle: {
                fontSize: 8,
              },
              header: [
                {
                style: 'header',
                columns: [
                  { text: 'Wydanie zewnętrzne nr ' + element.numer + '\n' + 'Numer WZ obcy ' + element.numer_wz_obcy ,alignment: 'left'},
                  { text: 'Wystawiono dnia: '+ moment().format("YYYY-MM-DD") ,alignment: 'right'}
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
                style: 'odbiorca_sprzedawca',
                columns: [
                  [
                    {text: 'Dostawca: '},
                    {text: element.kontrahent_nazwa},
                    {text: element.kontrahent_ulica_nr},
                    {text: element.kontrahent_kod_pocztowy + element.kontrahent_miasto},
                    {text: 'NIP: ' + element.nip},
                    {text: element.kontrahent_email}
                  ],
                  [
                    {text: 'Odbiorca: '},
                    {text: 'Intertrend Polska Sp. z o.o.'},
                    {text: '62-300 Września'},
                    {text: 'NIP: 5262789617'},
                    {text: 'biuro@intertrend.pl'}
                  ]
                ],
              },
                {text: 'POZYCJE', style: 'table_poz'},
                {
                  layout: 'lightHorizontalLines',
                  table: {
                    widths: [20, '*','*', 'auto', 80, '*' ],
                    body: this.buildTableBody(element.item, ['lp','numer_zam','uwagi_poz','nazwa','wytwor_idm','ilosc'],true,['Lp.','Numer zamówienia','Numer tury','Nazwa produktu','Indeks produktu','Ilość']),
                  }
                },
                {
                  style: 'wystawil_odebral',
                  columns: [
                    [
                      {text: '...................................'},
                      {text: '(Wystawił)'},
                    ],
                    [
                      {text: '...................................'},
                      {text: '(Odebrał)'},
                    ]
                  ],
                }
          
              ]  ,

              styles: {
                table_poz: {
                  margin:[0,25,0,0],
                  alignment: 'left'
                },
                header: {
                  margin:[25,10,25,10],
                  fontSize: 10
                },
                footer: {
                  margin:[10,10,10,10],
                },
                odbiorca_sprzedawca: {
                  margin:[0,25,0,25],
                  columnGap: 100,
                  fontSize: 10
                },
                wystawil_odebral: {
                  margin:[0,50,0,0],
                  alignment: 'center',
                  fontSize: 10
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


   textToBase64Barcode(text){
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
      format: "CODE128",
      displayValue: false});
    return canvas.toDataURL("data:image/jpeg;base64");
  }

  groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if(obj[key] === undefined) return hash; 
        return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
      }, {})
 }


   downloadOrderSupplierPDFCode128(element){ 
    this.spinner.show("actionList")
    this.deliveryNoteService.getDeliveryData(element.wydanie_nag_dost_id,'k_wydanie_nag_raport_k_wydanie_poz_raport').subscribe(
        (position) => {
          element = position['data']   
          
          var doc = new jsPDF()

          var column = [
            { header: 'LP', dataKey: 'lp' },
            { header: 'Numer zamowienia', dataKey: 'numer_zam' },
            { header: 'Numer tury', dataKey: 'uwagi_poz' },
            { header: 'Nazwa produktu', dataKey: 'nazwa' },
            { header: 'Indeks produktu', dataKey: 'wytwor_idm' },
            { header: 'Ilosc', dataKey: 'ilosc' },
            { header: 'Kod kreskowy                 ', dataKey: 'kod_wytwor' } 
          ]


          doc.setFontSize(10);
          doc.setFontStyle('normal');
          doc.text("Numer wydania: " + element.numer, 15, 10);
          doc.text("Numer WZ obcy: " + element.numer_wz_obcy, 15, 15);


          this.order_item_TURA =  this.groupByKey(element.item, 'uwagi_poz')


          Object.entries(this.order_item_TURA).forEach(element_tura => {
              doc.autoTable({
                columns: column,
                body: element_tura[1],
                startY: 40,
                rowPageBreak: 'avoid',
                theme: 'grid',
                showHead: 'everyPage',
                styles: {
                  minCellHeight: 25,
                  valign:'middle',
                  overflow: 'linebreak',
                  fontSize: 8
                },
                didDrawCell: (data) => {    
                  if (data.section === 'body' && data.column.index === 6) {
                    doc.addImage(this.textToBase64Barcode(data.cell.text), 'JPEG', data.cell.x + 1, data.cell.y + 5, 30, 15)
                    }
                },
              })
              doc.page++;
              doc.addPage()
            }) 


          var pageCount = doc.internal.getNumberOfPages();   
          doc.deletePage(pageCount)
          this.spinner.hide("actionList")
          doc.save(element.numer + '.pdf')
          
        },
        msg => {
          this.spinner.hide("actionList")
          console.log('Błąd podczas generowania etykiet', msg);
        }
      );
  
      }

  }


