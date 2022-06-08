import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import * as globalVar from '../shared/global';

interface isLoggedIn{
  status: boolean
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(
    private http: HttpClient
  ) { }


  getUserByEmail(email: string){
    return this.http.get<any[]>(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/validation.php?email=${email}`)
  }
  
  getUserByUsername(nazwa_uzytkownika: string){
    return this.http.get<any[]>(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/validation.php?nazwa_uzytkownika=${nazwa_uzytkownika}`)
  }


  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
  }

}
