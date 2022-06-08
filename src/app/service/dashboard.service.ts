import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import * as globalVar from '../shared/global';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {


  constructor(private http: HttpClient,
    private authService: AuthService)   {}
  
  
  getCharts(): Observable<any> {
      return this.http.get(`${globalVar.pathAPI+'/'+globalVar.version}/dashboard/getCharts.php`)
      .pipe(map((res) => {
        if( res['error'] == false){
        return res}
        else throw new Error(res['message'])
      }),
      catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
      console.log(error);
      return throwError('Error! something went wrong.');
    }

  }