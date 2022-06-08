import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as globalVar from '../shared/global';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data'
  })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;


user: User;
public businessAgreementHTML;

constructor(private http: HttpClient,private router: Router,public translate: TranslateService)
{
  this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
  this.currentUser = this.currentUserSubject.asObservable();
  this.translate.getTranslation(this.translate.getDefaultLang()).subscribe((translationObj) => { this.businessAgreementHTML = translationObj['BUSINESSAGREEMENT'] });
}


public get currentUserValue(): User {
  return this.currentUserSubject.value[0];
}


get isLoggedIn() {
  return tokenNotExpired();
}

logout() {
  this.router.navigate(['/login']);  
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  this.currentUserSubject.next(null);
}

loginUser(login:string,haslo:string): Observable<any>{
  return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/loginUser.php`,{login,haslo})
    .pipe(map((res) => {
      if( res['error'] == false){
        localStorage.setItem('currentUser', JSON.stringify(res['data']));
        this.currentUserSubject.next(res['data']);
        return res}
      else 
      {throw new Error(res['message'])}
    }),
    catchError(this.handleError));
  }

getUser(uzytkownik_id:number): Observable<User> {
  return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/getUserInfo.php`,{uzytkownik_id})
    .pipe(map((res) => {
      if( res['error'] == false){
      this.user = res['data'];  
      return res['message']}
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

registerUser(user: User): Observable<User> {
  var businessAgreement = this.businessAgreementHTML
  return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/registerNewUser.php`,{user,businessAgreement})
  .pipe(map((res) => {
    if( res['error'] == false)
    return res['message']
    else throw new Error(res['message'])
  }),
  catchError(this.handleError));
}

forgotPasssword(email:string): Observable<any> {
  return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/forgotPassword.php`,{email})
  .pipe(map((res) => {
    if( res['error'] == false)
    return res['message']
    else throw new Error(res['message'])
  }),
  catchError(this.handleError));
}

resetPasssword(haslo:string,token:string,uzytkownik_id:number): Observable<any> {
  return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/resetPassword.php`,{haslo,token,uzytkownik_id})
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

verifyEmail(token:string,uzytkownik_id:number): Observable<any>{
  return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/verifyEmail.php`,{token,uzytkownik_id})
  .pipe(map((res) => {
    if( res['error'] == false)
    return res['message']
    else throw new Error(res['message'])
  }),
  catchError(this.handleError));
}


regulationsUser(regulation: any,uzytkownik_id:number,returnHtml:string): Observable<any> {
  return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/authorization/insertRegulations.php`,{regulation,uzytkownik_id,returnHtml})
  .pipe(map((res) => {
    if( res['error'] == false)
    return res['message']
    else throw new Error(res['message'])
  }),
  catchError(this.handleError));
}


getUserByEmail(email: string){
  return this.http.get<any[]>(`${globalVar.pathAPI+'/'+globalVar.version}/user.php?email=${email}`)
}

permissionUser(obiekt_id){
  const dl = this.currentUserValue.permission.filter(permission => permission.obiekt_id == obiekt_id)
  if (dl.length > 0 )
    return true
  else
    return false
}

getDefaultLanguage(){
  return this.currentUserValue.jezyk
}


userId(){
  return this.currentUserValue.uzytkownik_id
}


isUserDepot(){
  if (this.user.grupa_id == 3)
    return true
  else
    return false
}


private handleError(error: HttpErrorResponse) {
  return throwError(error.message);
}

}
