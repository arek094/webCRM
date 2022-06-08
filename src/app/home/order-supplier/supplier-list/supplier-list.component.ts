import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { Order } from 'src/app/model/order';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthService } from 'src/app/auth/auth.service';
import { SupplierDetailsComponent } from '../supplier-details/supplier-details.component';
import {ExcelService} from '../../../service/excel.service'
import * as moment from 'moment'
import { OrderService } from 'src/app/service/order.service';
import { GenerateDeliveryNoteComponent } from '../generate-delivery-note/generate-delivery-note.component';
import { OrderSupplierService } from 'src/app/service/order-supplier.service';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackBarService } from 'src/app/service/snack-bar.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
pdfMake.vfs = pdfFonts.pdfMake.vfs; 
declare let JsBarcode: any;
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';




@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss']
})
export class SupplierListComponent implements AfterContentInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('orderservice') orderservice: OrderService;
  @ViewChild('content') content: ElementRef;
  
  
  displayedColumns: string[] = ['select','numer_zam','kontrahent_nazwa','status','data_realizacji','uwagi','anulowany','funkcje'];
  dataSource: MatTableDataSource<Order>;
  selection = new SelectionModel<Order>(true, []);
  orders: Order[] ;
  loading: boolean = true;
  dateTime: string = moment(Date.now()).format('YYYY-MM-DD')
  selectedDelivery = []
  order_item_TURA = []
  

  constructor(
    private orderSupplierService: OrderSupplierService,
    private toast: MatSnackBar,
    public authService: AuthService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private excelService:ExcelService,
    private snackBarService: SnackBarService,
    private spinner: NgxSpinnerService) {
      this.dataSource = new MatTableDataSource(this.orders);
    }

    ngAfterContentInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.refreshList();
    }


    showDetails(order){
      let dialogRef =  this.dialog.open(SupplierDetailsComponent, {
         panelClass: 'matDialog',
         data: {selectedOrder: order.zam_nag_dost_id, orderNag: order},
         minWidth: '80%',
         disableClose: false
       })
         dialogRef.afterClosed().subscribe(result => 
            this.refreshList()
      )}


      generateDeliveryNote(){
        if (this.selection.selected.length == 0) {
          this.snackBarService.openSnackBar('Nie wybrałeś żadnej pozycji do wydania.',"error","snackbar-error")
        } else {
          this.selection.selected.forEach(result => this.selectedDelivery.push(result.zam_nag_dost_id))
          let dialogRef =  this.dialog.open(GenerateDeliveryNoteComponent, {
             panelClass: 'matDialog',
             data: this.selectedDelivery,
             minWidth: '80%',
             disableClose: false
           })
             dialogRef.afterClosed().subscribe(result => {
              this.selectedDelivery = []
              this.selection.clear()
             } 
          )
        }
      }
    
    refreshList(){
      this.orderSupplierService.getOrderSupplierData(2,'k_zam_nag_dost_lista').subscribe(this.onSuccess.bind(this),this.onFailure.bind(this))
    }

    exportExcelSelected(){
      if (this.selection.selected.length == 0) {
        this.snackBarService.openSnackBar('Nie wybrałeś żadnej pozycji do wydania.',"error","snackbar-error")
      } else {
        this.selection.selected.forEach(result => this.selectedDelivery.push(result.zam_nag_dost_id))
        this.spinner.show("actionList")
        this.orderSupplierService.getOrderSupplierData(this.selectedDelivery,'k_zam_poz_raport_IN').subscribe(
          (position) => {
            this.spinner.hide("actionList")
            this.excelService.exportAsExcelFile(position['data'] , "Eksport" + moment().format("YYYY-MM-DD"));
            this.selectedDelivery = []
            this.selection.clear()
          },
          msg => {
            this.spinner.hide("actionList")
            console.log('Błąd podczas eksportu zamówienia.', msg);
            this.selectedDelivery = []
            this.selection.clear()
          }
        );
        
      }
    }


    downloadOrderSupplierPDFSelected(){
      if (this.selection.selected.length == 0) {
        this.snackBarService.openSnackBar('Nie wybrałeś żadnej pozycji.',"error","snackbar-error")
      } else {
        this.selection.selected.forEach(result => this.selectedDelivery.push(result.zam_nag_dost_id))
        this.spinner.show("actionList")
        this.orderSupplierService.getOrderSupplierData(this.selectedDelivery,'k_zam_poz_raport_SUM_IN').subscribe(
          (element) => {
            this.spinner.hide("actionList")

            element = element['data'] 

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
                  { text: 'Wygenerowano dnia: '+ moment().format("YYYY-MM-DD") ,alignment: 'left'},
                  { text: 'Raport sumaryczny',alignment: 'right'}
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
                {text: 'POZYCJE', style: 'table_poz'},
                {
                  table: {
                    widths: ['20%','45%', '20%', '10%' ,'5%'],
                    body: this.buildTableBody(element, ['numer_zam','wytwor_nazwa','wytwor_idm','ilosc_oczekiwana','jm_idn'],true,['Numer zamówienia','Nazwa produktu','Indeks produktu','Ilość','Jm']),
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
            this.selectedDelivery = []
            this.selection.clear()
          },
          msg => {
            this.spinner.hide("actionList")
            console.log('Błąd podczas generowania raportu.', msg);
            this.selectedDelivery = []
            this.selection.clear()
          }
        );
        
      }
    }


    exportExcel(order){
      this.spinner.show("actionList")
      this.orderSupplierService.getOrderSupplierData(order.zam_nag_dost_id,'k_zam_poz_raport').subscribe(
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

    exportCSV(order){
      this.spinner.show("actionList")
      this.orderSupplierService.getOrderSupplierData(order.zam_nag_dost_id,'k_zam_eksport_csv').subscribe(
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

          new AngularCsv(position['data'], order.numer_zam, options);
          //this.excelService.exportAsExcelFile(position['data'] , order.numer_zam);
        },
        msg => {
          this.spinner.hide("actionList")
          console.log('Błąd podczas eksportu zamówienia.', msg);
        }
      );
    }


    private onSuccess(res) {
      this.dataSource.data = res['data'];
      this.loading = false;
    }
  
    private onFailure(error) {
      console.log(error)
    }
  
  
    textToBase64Barcode(text){
      var canvas = document.createElement("canvas");
      JsBarcode(canvas, text, {
        format: "CODE128",
        displayValue: false});
      return canvas.toDataURL("data:image/jpeg;base64");
    }

   
    downloadLabelPDFSelected(){
      if (this.selection.selected.length == 0) {
        this.snackBarService.openSnackBar('Nie wybrałeś żadnej pozycji.',"error","snackbar-error")
      } else {
        this.selection.selected.forEach(result => this.selectedDelivery.push(result.zam_nag_dost_id))
        this.spinner.show("actionList")
        this.orderSupplierService.getOrderSupplierData(this.selectedDelivery,'k_zam_poz_dost_szczegoly_IN').subscribe(
          (element) => {

            element = element['data'] 

            var doc = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: ['227', '113']
            })
            doc.page=1;
            doc.setFontSize(7)
            element.forEach(element => {
              for (var i = 0; i < element.ilosc_oczekiwana ; i++)
              {
              doc.text(element.wytwor_idm, 1, 5)
              doc.addImage(this.textToBase64Barcode(element.kod_wytwor), 'PNG', 1 , 6 , 70, 15);
              doc.text('Nazwa: ' + element.wytwor_nazwa, 1, 25)
              doc.text('Kontrahent: ' + element.kontrahent_nazwa, 1, 29)
              doc.text('Odbiorca: INTERTREND POLSKA SP. Z O.O.', 1, 33)
              doc.page++;
              doc.addPage()
              }
            });
            doc.deletePage(doc.page)
            doc.save("Etykiety80x40" + moment().format("YYYY-MM-DD"))
            this.spinner.hide("actionList")
            this.selectedDelivery = []
            this.selection.clear()
          },
          msg => {
            this.spinner.hide("actionList")
            console.log('Błąd podczas generowania etykiet.', msg);
            this.selectedDelivery = []
            this.selection.clear()
          }
        );
        
      }
    }

  

    downloadLabelPDFSelected20x40(){
      if (this.selection.selected.length == 0) {
        this.snackBarService.openSnackBar('Nie wybrałeś żadnej pozycji.',"error","snackbar-error")
      } else {
        this.selection.selected.forEach(result => this.selectedDelivery.push(result.zam_nag_dost_id))
        this.spinner.show("actionList")
        this.orderSupplierService.getOrderSupplierData(this.selectedDelivery,'k_zam_poz_dost_szczegoly_IN').subscribe(
          (element) => {

            element = element['data'] 

            var doc = new jsPDF({
              unit: "mm",
              format: ['90', '113']
            })

            doc.page=1;
            doc.setFontSize(5)
            element.forEach(element => {
              for (var i = 0; i < element.ilosc_oczekiwana ; i++)
              {
                doc.text(element.wytwor_idm, 1, 2)
                doc.addImage(this.textToBase64Barcode(element.kod_wytwor), 'PNG', 1 , 3 , 39, 10);
                doc.setFontSize(5)
                doc.text(element.wytwor_nazwa, 1, 15)
                doc.text(element.kontrahent_nazwa, 1, 17)
                doc.page++;
                doc.addPage()
              }
            });
            doc.deletePage(doc.page)
            doc.save("Etykiety20x40" + moment().format("YYYY-MM-DD"))
            this.spinner.hide("actionList")
            this.selectedDelivery = []
            this.selection.clear()
          },
          msg => {
            this.spinner.hide("actionList")
            console.log('Błąd podczas generowania etykiet.', msg);
            this.selectedDelivery = []
            this.selection.clear()
          }
        );
        
      }
    }


    downloadLabel80x40PDFPojedyncze(element){    
      this.spinner.show("actionList")
      this.orderSupplierService.getOrderSupplierData(element.zam_nag_dost_id,'k_zam_poz_etykiety_bez_powtarzania').subscribe(
        (position) => {
          element.order_item = position['data']
          var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: ['227', '113']
          })

          doc.page=1;
          doc.setFontSize(7)
          element.order_item.forEach(order_item => {

            doc.text(order_item.wytwor_idm, 1, 5)
            doc.addImage(this.textToBase64Barcode(order_item.kod_wytwor), 'PNG', 1 , 6 , 70, 15);
            doc.text('Nazwa: ' + order_item.wytwor_nazwa, 1, 25)
            doc.text('Kontrahent: ' + element.kontrahent_nazwa, 1, 29)
            doc.text('Odbiorca: INTERTREND POLSKA SP. Z O.O.', 1, 33)
            doc.page++;
            doc.addPage()
            
          });
          doc.deletePage(doc.page)
          doc.save(element.numer_zam)
          this.spinner.hide("actionList")
        },
        msg => {
          this.spinner.hide("actionList")
          console.log('Błąd podczas generowania etykiet', msg);
        }
      );
    }


    downloadLabel80x40PDF(element){    
      this.spinner.show("actionList")
      this.orderSupplierService.getOrderSupplierData(element.zam_nag_dost_id,'k_zam_poz_etykiety').subscribe(
        (position) => {
          element.order_item = position['data']
          var doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: ['227', '113']
          })

          doc.page=1;
          doc.setFontSize(7)
          element.order_item.forEach(order_item => {
            for (var i = 0; i < order_item.ilosc_oczekiwana ; i++)
            {
            doc.text(order_item.wytwor_idm, 1, 5)
            doc.addImage(this.textToBase64Barcode(order_item.kod_wytwor), 'PNG', 1 , 6 , 70, 15);
            doc.text('Nazwa: ' + order_item.wytwor_nazwa, 1, 25)
            doc.text('Kontrahent: ' + element.kontrahent_nazwa, 1, 29)
            doc.text('Odbiorca: INTERTREND POLSKA SP. Z O.O.', 1, 33)
            doc.page++;
            doc.addPage()
            }
          });
          doc.deletePage(doc.page)
          doc.save(element.numer_zam)
          this.spinner.hide("actionList")
        },
        msg => {
          this.spinner.hide("actionList")
          console.log('Błąd podczas generowania etykiet', msg);
        }
      );
    }

  groupByKey(array, key) {
      return array
        .reduce((hash, obj) => {
          if(obj[key] === undefined) return hash; 
          return Object.assign(hash, { [obj[key]]:( hash[obj[key]] || [] ).concat(obj)})
        }, {})
   }
   
   

    downloadLabel80x40PerTuraPDF(element){    
      this.spinner.show("actionList")
      this.orderSupplierService.getOrderSupplierData(element.zam_nag_dost_id,'k_zam_poz_dost_szczegoly').subscribe(
        (position) => {
          element.order_item = position['data']

         this.order_item_TURA =  this.groupByKey(element.order_item, 'uwagi_poz')
         
         Object.entries(this.order_item_TURA).forEach(element_tura => {
            var doc = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: ['227', '113']
            })
         
           
            doc.page=1;
            doc.setFontSize(7) 
            element_tura[1].forEach(order_item => {
              for (var i = 0; i < order_item.ilosc_oczekiwana ; i++)
              {
              doc.text(order_item.wytwor_idm, 1, 5)
              doc.addImage(this.textToBase64Barcode(order_item.kod_wytwor), 'PNG', 1 , 6 , 70, 15);
              doc.text('Nazwa: ' + order_item.wytwor_nazwa, 1, 25)
              doc.text('Kontrahent: ' + element.kontrahent_nazwa, 1, 29)
              doc.text('Odbiorca: INTERTREND POLSKA SP. Z O.O.', 1, 33)
              doc.page++;
              doc.addPage()
              }
            });
            doc.deletePage(doc.page)
            setTimeout(() => {
              doc.save(element.numer_zam+element_tura[0])
            }, 5000);
            this.spinner.hide("actionList")
            
          })    
        },
        msg => {
          this.spinner.hide("actionList")
          console.log('Błąd podczas generowania etykiet', msg);
        }
      );
    }




    downloadLabel20x40PDF(element){    
      this.spinner.show("actionList")
      this.orderSupplierService.getOrderSupplierData(element.zam_nag_dost_id,'k_zam_poz_etykiety').subscribe(
        (position) => {
          element.order_item = position['data']
          var doc = new jsPDF({
            unit: "mm",
            format: ['90', '113']
          })
          doc.page=1;
          doc.setFontSize(5)
          element.order_item.forEach(order_item => {
            for (var i = 0; i < order_item.ilosc_oczekiwana ; i++)
            {
            doc.text(order_item.wytwor_idm, 1, 2)
            doc.addImage(this.textToBase64Barcode(order_item.kod_wytwor), 'PNG', 1 , 3 , 39, 10);
            doc.setFontSize(5)
            doc.text(order_item.wytwor_nazwa, 1, 15)
            doc.text(element.kontrahent_nazwa, 1, 17)
            doc.page++;
            doc.addPage()
            }
          });
          doc.deletePage(doc.page)
          doc.save(element.numer_zam)
          this.spinner.hide("actionList")
        },
        msg => {
          this.spinner.hide("actionList")
          console.log('Błąd podczas generowania etykiet', msg);
        }
      );
    }


    downloadLabel20x40PDFPojedyncze(element){    
      this.spinner.show("actionList")
      this.orderSupplierService.getOrderSupplierData(element.zam_nag_dost_id,'k_zam_poz_etykiety_bez_powtarzania').subscribe(
        (position) => {
          element.order_item = position['data']
          var doc = new jsPDF({
            unit: "mm",
            format: ['90', '113']
          })
          doc.page=1;
          doc.setFontSize(5)
          element.order_item.forEach(order_item => {

            doc.text(order_item.wytwor_idm, 1, 2)
            doc.addImage(this.textToBase64Barcode(order_item.kod_wytwor), 'PNG', 1 , 3 , 39, 10);
            doc.setFontSize(5)
            doc.text(order_item.wytwor_nazwa, 1, 15)
            doc.text(element.kontrahent_nazwa, 1, 17)
            doc.page++;
            doc.addPage()
            
          });
          doc.deletePage(doc.page)
          doc.save(element.numer_zam)
          this.spinner.hide("actionList")
        },
        msg => {
          this.spinner.hide("actionList")
          console.log('Błąd podczas generowania etykiet', msg);
        }
      );
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
          this.dataSource.data.forEach(row => this.selection.select(row));
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
    
    downloadOrderSupplierPDF(element){ 
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

        downloadOrderSupplierPDFCode128(element){ 
          this.spinner.show("actionList")
            this.orderService.getOrderMaterialData(element.zam_nag_dost_id,'k_zam_nag_dost_lista_k_zam_poz_dost_szczegoly').subscribe(
              (position) => {
                element = position['data']   
                
                var doc = new jsPDF()
                

                var column = [
                  { header: 'LP', dataKey: 'nr_poz' },
                  { header: 'Nazwa produktu', dataKey: 'wytwor_nazwa' },
                  { header: 'Indeks produktu', dataKey: 'wytwor_idm' },
                  { header: 'Ilosc', dataKey: 'ilosc_oczekiwana' },
                  { header: 'Jm', dataKey: 'jm_idn' },
                  { header: 'Kod kreskowy       ', dataKey: 'kod_wytwor' }
                  
                  
                ]

                doc.setFontSize(10);
                doc.setFontStyle('normal');
                doc.text("Numer zamówienia: " + element.numer_zam, 15, 10);
                doc.text("Kontrahent: " + element.kontrahent_nazwa, 15, 15);
                doc.text("Status: " + element.status_nazwa, 15, 20);
                doc.text("Uwagi: " + element.uwagi, 15, 25);

                doc.text("Data realizacji: " + element.data_realizacji, 130, 10);


                doc.autoTable({
                  columns: column,
                  body: element.item,
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
                    if (data.section === 'body' && data.column.index === 5) {
                      doc.addImage(this.textToBase64Barcode(data.cell.text), 'JPEG', data.cell.x + 1, data.cell.y + 5, 30, 15)
                      }
                  },
                })
                   
                this.spinner.hide("actionList")
                doc.save(element.numer_zam + '.pdf')
                
              },
              msg => {
                this.spinner.hide("actionList")
                console.log('Błąd podczas generowania etykiet', msg);
              }
            );
        
            }
      
    
}
