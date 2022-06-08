import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JwtHelper } from 'angular2-jwt';
import { AuthService } from '../auth/auth.service';
 
@Injectable()
export class HomeResolve implements Resolve<any> {

    jwtHelper: JwtHelper = new JwtHelper();

 constructor(private authService: AuthService){}
 resolve(route:ActivatedRouteSnapshot, 
        state:RouterStateSnapshot,
       ): Observable<any> {
    
    var token = localStorage.getItem('token');
    return this.authService.getUser(this.jwtHelper.decodeToken(token).uzytkownik_id); 
  }



}