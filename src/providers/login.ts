import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { TunariApi } from './tunari-api';

/**
 * Login endpoint provider. 
 */
@Injectable()
export class Login {

  baseUrl: string;

  endpoint: string = "login";

  constructor(public api: TunariApi) {
    this.baseUrl = this.api.baseUrl + "/login";
  }

  post(userName: string, password: string) {    

    return this.api.post(this.endpoint, { 
      userName: userName,
      password: password
    });
  }
}