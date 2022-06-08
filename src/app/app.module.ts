import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { HttpClientModule } from '@angular/common/http';
import { DashboardModule } from './home/dashboard/dashboard.module';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { OrderSupplierService } from './service/order-supplier.service';
import { UserService } from './auth/user.service';
import { UniqueEmailValidatorsDirective } from './shared/validators/unique-email-validators.directive';
import { UniqueUsernameValidatorsDirective } from './shared/validators/unique-username-validators.directive';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OrderService } from './service/order.service';
import { AdminPanelModule } from './home/admin-panel/admin-panel.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions } from '@angular/http';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { DeliveryNoteService } from './service/delivery-note.service';
import { NotificationService } from './service/notification.service';



export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    //headerName:'token',
    //headerPrefix: '',
    tokenName: 'token',
    tokenGetter: (() => localStorage.getItem('token')),
    globalHeaders: [{'Content-Type':'application/json'}],
    //noJwtError: true,
    //noTokenScheme: true
  }), http,options);
}

@NgModule({
  declarations: [
    AppComponent,
    UniqueEmailValidatorsDirective,
    UniqueUsernameValidatorsDirective
  ],
  imports: [
    TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    }
  }) ,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    AppRoutingModule,
    MaterialModule,
    HomeModule,
    DashboardModule,
    AdminPanelModule
    ],
  providers: [OrderService,AuthService,AuthGuard,OrderSupplierService,UserService,DeliveryNoteService,NotificationService,
  {
    provide: AuthHttp,
    useFactory: authHttpServiceFactory,
    deps: [Http, RequestOptions]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
