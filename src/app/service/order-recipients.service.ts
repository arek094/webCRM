import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Order } from '../model/order';
import * as globalVar from '../shared/global';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class OrderRecipientsService {
  


order: Order
permision: boolean

  constructor(
      private http: HttpClient,
      private authService: AuthService,
      private route: ActivatedRoute,
  ) { }

  
  insertTempDelivery(tempDelivery: any): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/order-recipients/insertTempDelivery.php?uzytkownik_id=${this.authService.userId()}`,  tempDelivery )
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  getOrderRecipientsData(id,source_data): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/order-recipients/getOrderRecipientsData.php?uzytkownik_id=${this.authService.userId()}`, {id,source_data})
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }

}
