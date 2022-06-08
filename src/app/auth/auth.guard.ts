import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
import { JwtHelper } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router,private userService: UserService){}
  

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Observable<boolean>|boolean{
    if (this.authService.isLoggedIn){
      if(this.authService.permissionUser(route.data.roles) == false){
        this.router.navigate(['/login']);      
        return false;
      }
      return true;
    }
    this.router.navigate(['/login']);      
    return false;
  }
}
