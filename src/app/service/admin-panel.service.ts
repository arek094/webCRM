import { Injectable, ViewChild } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { User } from '../model/user';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { UserGroup } from '../model/user-group';
import { Contractor } from '../model/contractor';
import { ModuleAccess } from '../model/module';
import { ObjectAccess } from '../model/object-access';
import { NewGroupComponent } from '../home/admin-panel/groups/new-group/new-group.component';
import { MatDialog } from '@angular/material';
import { GroupsComponent } from '../home/admin-panel/groups/groups.component';
import { AuthService } from '../auth/auth.service';
import * as globalVar from '../shared/global';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {


user: User;
userGroups: UserGroup[];
contractors: Contractor[];
modules: ModuleAccess[];
objectAccesss : ObjectAccess[];
permissions = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }


  getAdminPanelData(id,source_data): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/admin-panel/getAdminPanelData.php?uzytkownik_id=${this.authService.userId()}`, {id,source_data})
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }


  updateUser(uzytkownik_id:number, user: User): Observable<any>{
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/admin-panel/updateUser.php?uzytkownik_id=${uzytkownik_id}`,user)
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }
  

  updateGroupPermision(grupa_id:number, modul_id:number, permissions: any): Observable<any>{
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/admin-panel/updateGroupPermision.php?grupa_id=${grupa_id}&modul_id=${modul_id}`,permissions)
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  insertGroup(userGroups: UserGroup): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/admin-panel/insertGroup.php`,  userGroups )
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  updateGroup(grupa_id:number, grupa_nazwa:any): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/admin-panel/updateGroup.php?grupa_id=${grupa_id}`,grupa_nazwa)
      .pipe(map((res) => {
        if( res['error'] == false)
        return res['message']
        else throw new Error(res['message'])
      }),
      catchError(this.handleError));
    }
  

  insertUser(users: User): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/admin-panel/insertUser.php`,  users )
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
