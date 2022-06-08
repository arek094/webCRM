import { Injectable} from '@angular/core';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Order } from '../model/order';
import { Product } from '../model/product';
import { User } from '../model/user';
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
export class OrderService  {


orders: Order[];
order: Order
products: Product[]
user: User
permision: boolean




constructor(private http: HttpClient,
  private authService: AuthService)   {}

getOrderMaterialData(id,source_data): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/order-material/getOrderMaterialData.php?uzytkownik_id=${this.authService.userId()}`, {id,source_data})
    .pipe(map((res) => {
      if( res['error'] == false)
      return res
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }  


getProduct(): Observable<any> {
    return this.http.get(`${globalVar.pathAPI+'/'+globalVar.version}/order-material/getProduct.php`)
      .pipe(map((res) => {
        if( res['error'] == false)
        return res
        else throw new Error(res['message'])
      }),
      catchError(this.handleError));
    }


  editOrder(zam_nag_dost_id:number, order: Order, deletes_poz: any, cancel_poz: any): Observable<any>{
    var data = {order:order,deletes_poz:deletes_poz, cancel_poz:cancel_poz}
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/order-material/updateOrder.php?zam_nag_dost_id=${zam_nag_dost_id}&uzytkownik_id=${this.authService.userId()}`,data)
    .pipe(map((res) => {
      if( res['error'] == false)
      return res['message']
      else throw new Error(res['message'])
    }),
    catchError(this.handleError));
  }

  actionOrder(zam_nag_dost_id:number,action:number,uzytkownik_id: number): Observable<any>{
    return this.http.get(`${globalVar.pathAPI+'/'+globalVar.version}/order-material/actionOrder.php?zam_nag_dost_id=${zam_nag_dost_id}&action=${action}&uzytkownik_id=${uzytkownik_id}`)
  }


  getItemOrder(zam_nag_dost_id: string): Observable<any> {
    return this.http.get(`${globalVar.pathAPI+'/'+globalVar.version}/order-material/getItemOrder.php?zam_nag_dost_id=${zam_nag_dost_id}`)
      .pipe(map((res) => {
        if( res['error'] == false){
        this.order = res['data'];  
        return res}
        else throw new Error(res['message'])
      }),
      catchError(this.handleError));
    }

  insertOrder(order: Order): Observable<any> {
    return this.http.post(`${globalVar.pathAPI+'/'+globalVar.version}/order-material/insertOrder.php`,  order )
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