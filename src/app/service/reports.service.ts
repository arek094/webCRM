import { Injectable } from '@angular/core';
import * as moment from 'moment'
import { Observable, throwError } from 'rxjs';
import { Order } from '../model/order';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { OrderService } from '../service/order.service';
import * as globalVar from '../shared/global';
declare let jsPDF;

  
declare let JsBarcode: any;


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  
  order: Order;
  
  constructor(
    private http: HttpClient
  ) { }


  getOrder(zam_nag_dost_id:number): Observable<Order> {
    return this.http.get(`${globalVar.pathAPI+'/'+globalVar.version}/reports/getOrderReports.php?zam_nag_dost_id=${zam_nag_dost_id}`).pipe(
      map((res) => {
        this.order = res['data'];
        return this.order;
    }),
    catchError(this.handleError));
  }


  public generateReports(zam_nag_dost_id:number){
    this.getOrder(zam_nag_dost_id).subscribe((value)  => { 
    var doc = new jsPDF();
    //doc.addFileToVFS("NotoSans-Light.ttf", '/dist/sk-planes/NotoSans-Light-normal.js');
    //doc.addFont('NotoSans-Light.ttf', 'NotoSans-Light', 'normal');
    //doc.setFont('NotoSans-Light-normal');
    var totalPagesExp = "{total_pages_count_string}";
    var imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAC+0lEQVR4nO2bO2gUURSGv8QgkiKKSBQrC5GgIhIsxFSCaGsrFhYiaCUEFIQkIioi1r5AwQco9mIhxEIERQRBlIhahxjSmEIsstFiRlAys7vnnv/OnWz2g2FhZ+ecM9/svXPncXtoTR9wEjgCbG7j9zF4AJxPkXgNMAn8rsFyMfK+FnI5sNiOkfBdVHhtJfQ0WTcA/Giyfh54l38q2QZsb/GbS8C4OO8S1lF8BBrABaA/Ut6zJXkrbw5lAkYj521XQHQJRQK+Ar0xk2IT4JZg3ZnnwKInYQTGcEiwCpgLTRSZYAlWAY2QJBURJCF2e64as4ROEwBGCZ0oAAwSOlUAtCmhkwVAGxLqKOCXON4Y2aCukDoKeFtlsjoKeAO8qCpZHQVAdvutkn9CXxVJApgFRoDDwH5sl96788VN0dXghCJwZCZYWndpJ6j6B6zGfsd4Bn2Pb0Yh4ADwBFhv3G4eOAo8FdQQjKITvI595yG753hbkN+FQsAGx7Yh4qQoBNxwbHtLkN+Fog8YB14DO43bfSZx+wfdWeBZviw76joSrIyugNQFpEYhYBiYovqHpFN5bhcKAXeBIUEcK0N5bhcKAVsEMZLlVgh4JIiRLLdiHHAaeA/sEMSy8Am45w2iELAA3BHESUL3NJi6gNSseAGKPmArcBP71aCXj8Ap4JsniELAfWCfII6VTXnuEU8QRROo+shLcysEpLwP4M6taALHgS/ALkEsCx+Aq94gCgE/SfQmt4IVfxrsCkhdQGoUfcAgcI3slFSV0EWygdAZsifJwSgEPAQOCuJYGSYbDB3yBFEcsRSjwL/s9QZQCHgpiBHKK28AaxNYVfDdMeAKaS6GzhV8X1RjKVYBRU+C54ATxjgx8Tyt/o9UEyY89JLV2PYrMs1INWXGwyjFNUsFxJ40FUI/WU0NjALqOG3OygCwJ/8sYy0ldTYTANnEycGwumrDLLCxbGWrDm3Z3u//B9c+1GnydMgyme9DKa2aANRj+ryVaeAx2UtYC81++Ad5YmWh8WJDsAAAAABJRU5ErkJggg=='
    
    var columns = [
      {title: "Lp.", dataKey: "nr_poz"},
      {title: "Nazwa wytworu", dataKey: "wytwor_nazwa"},
      {title: "Ilosc oczekiwana", dataKey: "ilosc_oczekiwana"}
    ];

    var rows = value[0].order_item
    const dateTime = moment(Date.now()).format('YYYY-MM-DD').toString()


    doc.autoTable(columns,rows,{
      //styles: {font: 'NotoSans-Light'},
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(10);
        doc.text("Firma: " + value[0].kontrahent_nazwa, data.settings.margin.left, 10);
        doc.text("Wykonano: " + dateTime, data.settings.margin.left + 145, 10);
        doc.setFontSize(20);
        doc.setTextColor(45);
        doc.setFontStyle('bold');
        doc.addImage(imgData, 'PNG', data.settings.margin.left, 15, 10, 10);
        doc.text("Raport wydania" , data.settings.margin.left + 15, 24);
        doc.setFontSize(12);
        doc.setFontStyle('normal');
        doc.text("Zamówienie nr: " + value[0].numer_zam , data.settings.margin.left + 15, 32);
        doc.text("Data realizacji: " + value[0].data_realizacji, data.settings.margin.left + 15, 38);
        doc.text("Data realizacji magazyn: " + value[0].data_realizacji_magazyn, data.settings.margin.left + 15, 44);
        doc.text("Uwagi: " + value[0].uwagi , data.settings.margin.left + 15, 50);

        // Footer
        var str = "Strona " + doc.internal.getNumberOfPages()
        if (typeof doc.putTotalPages === 'function') {
            str = str + " z " + totalPagesExp;
        }
        doc.setFontSize(10);
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
        var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        doc.text(str, pageWidth / 2, pageHeight - 10,'center');
      },margin: {top: 60}})

      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp)}
    doc.save(value[0].numer_zam);
    },this.onFailureList.bind(this))
  }



  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
  }

  private onFailureList(){
    console.log('Failure')
  }

}
