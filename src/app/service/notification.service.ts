import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../auth/auth.service';
import * as globalVar from '../shared/global';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }


  insertNotification(data: any): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/notification/insertNotification.php?uzytkownik_id=${this.authService.userId()}`,  data )
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  getNotificationData(id,source_data): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/notification/getNotificationData.php?uzytkownik_id=${this.authService.userId()}`, {id,source_data})
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  actionNotification(source_data: any, action_id: number ): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/notification/action.php?uzytkownik_id=${this.authService.userId()}&action=${action_id}`, {source_data})
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
