import { Injectable} from '@angular/core';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Order } from '../model/order';
import { Product } from '../model/product';
import { User } from '../model/user';
import { AuthService } from '../auth/auth.service';
import { ErrorMessage } from '../model/message-error';
import * as globalVar from '../shared/global';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService  {


user: User

constructor(private http: HttpClient,
  private authService: AuthService)   {}

  changePassword(change_password: any): Observable<any>{
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/account-settings/changePassword.php?uzytkownik_id=${this.authService.userId()}`,change_password)
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  getUserAccount(uzytkownik_id: number): Observable<any> {
    return this.http.get(`${globalVar.pathAPI+'/'+globalVar.version}/account-settings/getUserAccount.php?uzytkownik_id=${uzytkownik_id}`)
      .pipe(map((res) => {
        if( res['error'] == false)
        return res
        else throw new Error(res['message'])
      }),
      catchError(this.handleError));
    }

  updateUserAccount(user: User): Observable<User>{
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/account-settings/updateUserAccount.php?uzytkownik_id=${this.authService.userId()}`,user)
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(error.message);
  }


}