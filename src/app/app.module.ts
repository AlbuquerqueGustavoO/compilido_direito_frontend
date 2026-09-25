import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from './shared/shared-module/shared-module';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from './service/analytics.service';
import { CommonModule } from '@angular/common';
import { initializeDatadog } from './core/datadog/datadog.config';
import { GlobalErrorHandler } from './core/datadog/global-error-handler';
import { ErrorHandler } from '@angular/core';
import { AuthInterceptor } from './service/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    CommonModule
  ],
  providers: [AnalyticsService,
  {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
      console.log('AppModule carregado');
        initializeDatadog();
    }
}
