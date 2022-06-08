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

export class DeliveryNoteService {


permision: boolean

  constructor(
      private http: HttpClient,
      private authService: AuthService,
      private route: ActivatedRoute,
  ) { }

  getDeliveryData(id,source_data): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/delivery-note/getDeliveryData.php?uzytkownik_id=${this.authService.userId()}`, {id,source_data})
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }


  getDeliveryNoteTemp(): Observable<any> {
    return this.http.get(`${globalVar.pathAPI+'/'+globalVar.version}/delivery-note/getTempDelivery.php?uzytkownik_id=${this.authService.userId()}`)
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  getDeliveryNoteTempPoz(deliveryPoz): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/delivery-note/getTempDeliveryPoz.php?uzytkownik_id=${this.authService.userId()}`, {deliveryPoz})
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  actionDeliveryNote(deliverydata: any, action_id: number ): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/delivery-note/action.php?uzytkownik_id=${this.authService.userId()}&action=${action_id}`, {deliverydata})
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }


  getDeliveryNote(): Observable<any> {
    return this.http.get(`${globalVar.pathAPI+'/'+globalVar.version}/delivery-note/getDelivery.php?uzytkownik_id=${this.authService.userId()}`)
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }


  getDeliveryNotePoz(deliveryPoz): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/delivery-note/getDeliveryPoz.php?uzytkownik_id=${this.authService.userId()}`, {deliveryPoz})
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
