import { ErrorHandler, Injectable } from '@angular/core';
import { datadogRum } from '@datadog/browser-rum';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  handleError(error: any): void {

    datadogRum.addError(error, {
      source: 'angular-global-handler'
    });

    console.error(error);
  }
}