import { Injectable} from '@angular/core';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { HelpMessage } from '../model/help-message';
import * as globalVar from '../shared/global';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class HelpMessageService  {

helpMessage: HelpMessage

constructor(private http: HttpClient,
  private authService: AuthService)   {}


  sendHelpMessage(helpMessage: HelpMessage): Observable<HelpMessage>{
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/account-settings/sendHelpMessage.php?uzytkownik_id=${this.authService.userId()}`,helpMessage)
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
  }


}